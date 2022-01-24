package expressions

import (
	"bytes"
	"fmt"
	"regexp"
	"strings"
	"text/template"

	"github.com/Masterminds/sprig"
	"github.com/gobwas/glob"
	"github.com/pubg/kubeconfig-updater/backend/application/configs"
)

type ExprType string

const (
	Format     ExprType = "Format"
	GoTemplate ExprType = "GoTemplate"
	Regex      ExprType = "Regex"
	Glob       ExprType = "Glob"
)

var exprTypes = []ExprType{Format, GoTemplate, Regex, Glob}

func FromString(exprType string) (ExprType, error) {
	for _, e := range exprTypes {
		if string(e) == exprType {
			return e, nil
		}
	}
	return "", fmt.Errorf("expression parse Error: Notsupported Type received, type=%s", exprType)
}

type Expression struct {
	exprType   ExprType
	expression string
}

func NewExpression(exprType ExprType, expression string) *Expression {
	return &Expression{exprType: exprType, expression: expression}
}

func NewFromConfig(expr configs.Expression) (*Expression, error) {
	exprType, err := FromString(expr.Type)
	if err != nil {
		return nil, err
	}
	return NewExpression(exprType, expr.Expression), nil
}

func (e *Expression) StringEvaluate(inputMap map[string]string, inputs []interface{}) (string, error) {
	if e.exprType == Format {
		return e.EvalStringFormat(inputs...), nil
	} else if e.exprType == GoTemplate {
		return e.EvalGoTemplate(inputMap)
	} else {
		return "", fmt.Errorf("expression exprType Error: StringEvaluate not Supported exprType, type=%s", string(e.exprType))
	}
}

func (e *Expression) MatchEvaluate(inputMap map[string]string, lineInput string) (bool, error) {
	if e.exprType == Regex {
		return e.MatchRegex(lineInput)
	} else if e.exprType == Glob {
		return e.MatchGlob(lineInput), nil
	} else if e.exprType == GoTemplate {
		return e.MatchGoTemplate(inputMap)
	} else {
		return false, fmt.Errorf("expression exprType Error: MatchEvaluate not Supported exprType, type=%s", string(e.exprType))
	}
}

func (e *Expression) EvalGoTemplate(input map[string]string) (string, error) {
	tmpl, err := template.New("gotmpl").Funcs(sprig.TxtFuncMap()).Parse(e.expression)
	if err != nil {
		return "", err
	}
	tmpl.Option("missingkey=error")

	buffer := bytes.NewBuffer(make([]byte, 0, 0))
	err = tmpl.Execute(buffer, input)
	if err != nil {
		return "", err
	}
	return strings.TrimSpace(buffer.String()), nil
}

func (e *Expression) EvalStringFormat(inputs ...interface{}) string {
	return fmt.Sprintf(e.expression, inputs...)
}

func (e *Expression) MatchGoTemplate(input map[string]string) (bool, error) {
	result, err := e.EvalGoTemplate(input)
	if err != nil {
		return false, err
	}

	normalizedResult := strings.ToLower(result)
	if normalizedResult == "false" {
		return false, nil
	} else if normalizedResult == "true" {
		return true, nil
	} else {
		return false, fmt.Errorf("expression Unknown Result: cannot parse to bool, result=%s", result)
	}
}

func (e *Expression) MatchGlob(input string) bool {
	g := glob.MustCompile(e.expression)
	return g.Match(input)
}

func (e *Expression) MatchRegex(input string) (bool, error) {
	regex, err := regexp.Compile(e.expression)
	if err != nil {
		return false, err
	}

	match := regex.MatchString(input)
	return match, nil
}
