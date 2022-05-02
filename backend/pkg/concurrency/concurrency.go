package concurrency

import (
	"sync"
	"time"
)

type WorkFunc func(in interface{}) (output interface{}, err error)

type ParallelOut struct {
	Input    interface{}
	Output   interface{}
	Err      error
	Duration time.Duration
}

func NonParallel(inputs []interface{}, workFunc WorkFunc) []ParallelOut {
	outChan := make(chan ParallelOut, len(inputs))
	defer close(outChan)
	for _, input := range inputs {
		newRefInput := input
		start := time.Now()
		out, err := workFunc(newRefInput)
		duration := time.Since(start)
		outChan <- ParallelOut{
			Input:    newRefInput,
			Output:   out,
			Err:      err,
			Duration: duration,
		}
	}

	var outs []ParallelOut
	for i := 0; i < len(inputs); i++ {
		outs = append(outs, <-outChan)
	}
	return outs
}

func Parallel(inputs []interface{}, workFunc WorkFunc) []ParallelOut {
	wg := sync.WaitGroup{}
	outChan := make(chan ParallelOut, len(inputs))
	defer close(outChan)
	for _, input := range inputs {
		wg.Add(1)
		newRefInput := input
		go func() {
			defer wg.Done()
			start := time.Now()
			out, err := workFunc(newRefInput)
			duration := time.Since(start)
			outChan <- ParallelOut{
				Input:    newRefInput,
				Output:   out,
				Err:      err,
				Duration: duration,
			}
		}()
	}
	wg.Wait()

	var outs []ParallelOut
	for i := 0; i < len(inputs); i++ {
		outs = append(outs, <-outChan)
	}
	return outs
}
