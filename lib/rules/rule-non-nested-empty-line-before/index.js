"use strict"

const isStandardSyntaxRule = require("../../utils/isStandardSyntaxRule")
const ruleMessages = require("../../utils/ruleMessages")
const validateOptions = require("../../utils/validateOptions")
const checkRuleEmptyLineBefore = require("../checkRuleEmptyLineBefore")

const ruleName = "rule-non-nested-empty-line-before"

const messages = ruleMessages(ruleName, {
  expected: "Expected empty line before non-nested rule",
  rejected: "Unexpected empty line before non-nested rule",
})

const rule = function (expectation, options) {
  return (root, result) => {
    const validOptions = validateOptions(result, ruleName, {
      actual: expectation,
      possible: [
        "always",
        "never",
        "always-multi-line",
        "never-multi-line",
      ],
    }, {
      actual: options,
      possible: {
        ignore: ["after-comment"],
        except: ["after-single-line-comment"],
      },
      optional: true,
    })
    if (!validOptions) {
      return
    }

    result.warn((
      `'${ruleName}' has been deprecated and in 8.0 will be removed. Instead use 'rule-empty-line-before'.`
    ), {
      stylelintType: "deprecation",
      stylelintReference: `https://stylelint.io/user-guide/rules/${ruleName}/`,
    })

    root.walkRules(rule => {
      if (!isStandardSyntaxRule(rule)) {
        return
      }

      // Ignore nested rule sets
      if (rule.parent !== root) {
        return
      }

      // Ignore the first node
      if (rule === root.first) {
        return
      }

      checkRuleEmptyLineBefore({ rule, expectation, options, result, messages, checkedRuleName: ruleName })
    })
  }
}

rule.ruleName = ruleName
rule.messages = messages
module.exports = rule
