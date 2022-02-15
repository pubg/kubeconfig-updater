package common

import (
	"bytes"
	"errors"
	"fmt"
	"log"
	"os"
	"os/exec"
	"path/filepath"
	"reflect"
	"strings"
	"syscall"
)

func SimpleExecute(commandLine string, failureMessage string) error {
	stdout, stderr, exitCode, err := Execute(commandLine)
	if stdout != "" {
		fmt.Println("STDOUT: " + strings.Trim(stdout, "\n"))
	}
	if stderr != "" {
		fmt.Println("STDERR: " + strings.Trim(stderr, "\n"))
	}

	if exitCode != 0 {
		return fmt.Errorf("%s: %s", failureMessage, stderr)
	}
	if err != nil {
		return fmt.Errorf("%s: %s", failureMessage, err.Error())
	}
	return nil
}

func Execute(commandLine string) (stdout string, stderr string, exit int, err error) {
	exit = 0

	commands := strings.Split(commandLine, " ")
	cmd := exec.Command(commands[0], commands[1:]...)
	var bufOut bytes.Buffer
	var bufErr bytes.Buffer
	cmd.Stdout = &bufOut
	cmd.Stderr = &bufErr

	cmdErr := cmd.Run()
	if cmdErr != nil {
		if exiterr, ok := cmdErr.(*exec.ExitError); ok {
			if status, ok := exiterr.Sys().(syscall.WaitStatus); ok {
				exit = status.ExitStatus()
			} else {
				err = fmt.Errorf("ExitError: %s", cmdErr.Error())
			}
		} else if exiterr2, ok := cmdErr.(*exec.Error); ok {
			err = fmt.Errorf("ExecError: PATH=%s, %s", os.Getenv("PATH"), exiterr2.Error())
		} else {
			err = fmt.Errorf("ExecUnknownError: %s", cmdErr.Error())
		}
	}

	stdout = bufOut.String()
	stderr = bufErr.String()
	fmt.Printf("Command execute: %s, exitcode: %d\n", commandLine, exit)
	return
}

func IsBinaryExists(name string) bool {
	_, err := exec.LookPath(name)
	return err == nil
}

func ResolvePathToAbs(path string) (string, error) {
	if strings.HasPrefix(path, "~") {
		home, err := os.UserHomeDir()
		if err != nil {
			return "", err
		}
		path = strings.Replace(path, "~", home, 1)
	}
	return filepath.Abs(path)
}

func GetItemOrError(m map[string]string, key string) (string, error) {
	if m == nil {
		return "", fmt.Errorf("map should not be null, key:%s", key)
	}
	if value, exists := m[key]; exists {
		return value, nil
	}
	return "", fmt.Errorf("map doesn't have key, key:%s", key)
}

func ExistsFile(absPath string) bool {
	_, err := os.Stat(absPath)
	return !errors.Is(err, os.ErrNotExist)
}

func ToInterfaceSlice(slice interface{}) []interface{} {
	s := reflect.ValueOf(slice)
	if s.Kind() != reflect.Slice {
		panic("InterfaceSlice() given a non-slice type")
	}

	// Keep the distinction between nil and empty slice input
	if s.IsNil() {
		return nil
	}

	ret := make([]interface{}, s.Len())

	for i := 0; i < s.Len(); i++ {
		ret[i] = s.Index(i).Interface()
	}

	return ret
}

func TypeCastError(typeName string) error {
	return fmt.Errorf("failed cast value to %s", typeName)
}

func GetKubeconfigPath() string {
	path, err := ResolvePathToAbs(filepath.Join("~", ".kube", "config"))
	if err != nil {
		log.Fatalln(err)
	}
	return path
}
