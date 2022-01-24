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
	"runtime/debug"
	"strings"
	"syscall"
)

func Execute(commandLine string) (stdout *string, stderr *string, exit int) {
	stdout = nil
	stderr = nil
	exit = 0

	commands := strings.Split(commandLine, " ")
	cmd := exec.Command(commands[0], commands[1:]...)
	var bufOut bytes.Buffer
	var bufErr bytes.Buffer
	cmd.Stdout = &bufOut
	cmd.Stderr = &bufErr

	err := cmd.Run()
	if err != nil {
		if exiterr, ok := err.(*exec.ExitError); ok {
			if status, ok := exiterr.Sys().(syscall.WaitStatus); ok {
				exit = status.ExitStatus()
			}
		} else {
			debug.PrintStack()
			log.Fatalf("cmd.Wait: %s, %v", commandLine, err)
		}
	}

	sout := bufOut.String()
	stdout = &sout

	serr := bufErr.String()
	stderr = &serr
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
