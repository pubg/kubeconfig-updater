package azure_service

import (
	"fmt"
	"testing"
)

func TestGetSubscriptions(t *testing.T) {
	subs, err := GetSubscriptions()
	if err != nil {
		t.Error(err)
	}
	fmt.Printf("%+v\n", subs)
}
