module AST.Decoding exposing (decode, decodeInfix)

import AST.Ranges as Ranges
import AST.Types exposing (..)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Util.Json exposing (decodeTyped)


decode : Decoder File
decode =
    JD.succeed File
        |: JD.field "moduleDefinition" decodeModule
        |: JD.field "imports" (JD.list decodeImport)
        |: JD.field "declarations" (JD.list decodeDeclaration)


decodeModule : Decoder Module
decodeModule =
    decodeTyped
        [ ( "normal", decodeDefaultModuleData |> JD.map NormalModule )
        , ( "port", decodeDefaultModuleData |> JD.map PortModule )
        , ( "effect", decodeEffectModuleData |> JD.map EffectModule )
        , ( "nomodule", JD.succeed NoModule )
        ]


decodeDefaultModuleData : Decoder DefaultModuleData
decodeDefaultModuleData =
    JD.succeed DefaultModuleData
        |: JD.field "moduleName" decodeModuleName
        |: JD.field "exposingList" (decodeExposingList decodeExpose)


decodeEffectModuleData : Decoder EffectModuleData
decodeEffectModuleData =
    JD.succeed EffectModuleData
        |: JD.field "moduleName" decodeModuleName
        |: JD.field "exposingList" (decodeExposingList decodeExpose)
        |: JD.field "command" (JD.maybe JD.string)
        |: JD.field "subscription" (JD.maybe JD.string)


decodeModuleName : Decoder ModuleName
decodeModuleName =
    JD.list JD.string


decodeExpose : Decoder Expose
decodeExpose =
    decodeTyped
        [ ( "infix", JD.map2 InfixExpose (JD.field "name" JD.string) (JD.field "range" Ranges.decode) )
        , ( "function", JD.map2 FunctionExpose (JD.field "name" JD.string) (JD.field "range" Ranges.decode) )
        , ( "typeOrAlias", JD.map2 TypeOrAliasExpose (JD.field "name" JD.string) (JD.field "range" Ranges.decode) )
        , ( "typeexpose"
          , JD.map3 TypeExpose
                (JD.field "name" JD.string)
                (JD.field "inner" <| decodeExposingList decodeValueConstructorExpose)
                (JD.field "range" Ranges.decode)
          )
        ]


decodeValueConstructorExpose : Decoder ValueConstructorExpose
decodeValueConstructorExpose =
    JD.succeed (,)
        |: JD.field "name" JD.string
        |: JD.field "range" Ranges.decode


decodeExposingList : Decoder a -> Decoder (Exposure a)
decodeExposingList x =
    JD.lazy
        (\() ->
            decodeTyped
                [ ( "none", (JD.succeed None) )
                , ( "all", Ranges.decode |> JD.map All )
                , ( "explicit", JD.list x |> JD.map Explicit )
                ]
        )


decodeImport : Decoder Import
decodeImport =
    JD.succeed Import
        |: JD.field "moduleName" decodeModuleName
        |: JD.field "moduleAlias" (JD.maybe decodeModuleName)
        |: JD.field "exposingList" (decodeExposingList decodeExpose)
        |: JD.field "range" Ranges.decode


decodeDeclaration : Decoder Declaration
decodeDeclaration =
    JD.lazy
        (\() ->
            decodeTyped
                [ ( "function", decodeFunction |> JD.map FuncDecl )
                , ( "typeAlias", decodeTypeAlias |> JD.map AliasDecl )
                , ( "typedecl", decodeType |> JD.map TypeDecl )
                , ( "port", decodeSignature |> JD.map PortDeclaration )
                , ( "infix", decodeInfix |> JD.map InfixDeclaration )
                , ( "destrucutring", decodeDestructuring |> JD.map DestructuringDeclaration )
                ]
        )


decodeInfix : Decoder Infix
decodeInfix =
    JD.succeed Infix
        |: JD.field "direction" decodeInfixDirection
        |: JD.field "precedence" JD.int
        |: JD.field "operator" JD.string


decodeDestructuring : Decoder Destructuring
decodeDestructuring =
    JD.lazy
        (\() ->
            JD.succeed Destructuring
                |: JD.field "pattern" decodePattern
                |: JD.field "expression" decodeExpression
        )


decodeType : Decoder Type
decodeType =
    JD.succeed Type
        |: JD.field "name" JD.string
        |: JD.field "generics" (JD.list JD.string)
        |: JD.field "constructors" (JD.list decodeValueConstructor)


decodeValueConstructor : Decoder ValueConstructor
decodeValueConstructor =
    JD.succeed ValueConstructor
        |: JD.field "name" JD.string
        |: JD.field "arguments" (JD.list decodeTypeReference)
        |: JD.field "range" Ranges.decode


decodeTypeAlias : Decoder TypeAlias
decodeTypeAlias =
    JD.succeed TypeAlias
        |: JD.field "name" JD.string
        |: JD.field "generics" (JD.list JD.string)
        |: JD.field "typeReference" decodeTypeReference
        |: JD.field "range" Ranges.decode


decodeFunction : Decoder Function
decodeFunction =
    JD.lazy
        (\() ->
            JD.succeed Function
                |: JD.field "documentation" (JD.maybe JD.string)
                |: JD.field "signature" (JD.maybe decodeSignature)
                |: JD.field "declaration" decodeFunctionDeclaration
        )


decodeSignature : Decoder FunctionSignature
decodeSignature =
    JD.succeed FunctionSignature
        |: JD.field "operatorDefinition" JD.bool
        |: JD.field "name" JD.string
        |: JD.field "typeReference" decodeTypeReference


decodeTypeReference : Decoder TypeReference
decodeTypeReference =
    JD.lazy
        (\() ->
            decodeTyped
                [ ( "generic", JD.string |> JD.map GenericType )
                , ( "typed", JD.map3 Typed (JD.field "moduleName" decodeModuleName) (JD.field "name" JD.string) (JD.field "args" <| JD.list decodeTypeArg) )
                , ( "unit", JD.succeed Unit )
                , ( "tupled", JD.list decodeTypeReference |> JD.map Tupled )
                , ( "function", JD.map2 FunctionTypeReference (JD.field "left" decodeTypeReference) (JD.field "right" decodeTypeReference) )
                , ( "record", decodeRecordDefinition |> JD.map Record )
                , ( "genericRecord", JD.map2 GenericRecord (JD.field "name" JD.string) (JD.field "values" decodeRecordDefinition) )
                ]
        )


decodeRecordDefinition : Decoder RecordDefinition
decodeRecordDefinition =
    JD.lazy
        (\() ->
            JD.list decodeRecordField
        )


decodeRecordField : Decoder RecordField
decodeRecordField =
    JD.lazy
        (\() ->
            JD.succeed (,)
                |: JD.field "name" JD.string
                |: JD.field "typeReference" decodeTypeReference
        )


decodeTypeArg : Decoder TypeArg
decodeTypeArg =
    JD.lazy
        (\() ->
            decodeTyped
                [ ( "generic", JD.string |> JD.map Generic )
                , ( "concrete", decodeTypeReference |> JD.map Concrete )
                ]
        )


decodeFunctionDeclaration : Decoder FunctionDeclaration
decodeFunctionDeclaration =
    JD.lazy
        (\() ->
            JD.succeed FunctionDeclaration
                |: JD.field "operatorDefinition" JD.bool
                |: JD.field "name" decodeVariablePointer
                |: JD.field "arguments" (JD.list decodePattern)
                |: JD.field "expression" decodeExpression
        )


decodeVariablePointer : Decoder VariablePointer
decodeVariablePointer =
    JD.succeed VariablePointer
        |: JD.field "value" JD.string
        |: JD.field "range" Ranges.decode


decodeChar : Decoder Char
decodeChar =
    JD.string
        |> JD.andThen
            (\s ->
                case String.uncons s of
                    Just ( c, _ ) ->
                        JD.succeed c

                    Nothing ->
                        JD.fail "Not a char"
            )


decodePattern : Decoder Pattern
decodePattern =
    JD.lazy
        (\() ->
            decodeTyped
                [ ( "all", JD.succeed AllPattern )
                , ( "unit", JD.succeed UnitPattern )
                , ( "char", decodeChar |> JD.map CharPattern )
                , ( "string", JD.string |> JD.map StringPattern )
                , ( "int", JD.int |> JD.map IntPattern )
                , ( "float", JD.float |> JD.map FloatPattern )
                , ( "tuple", JD.list decodePattern |> JD.map TuplePattern )
                , ( "record", JD.list decodeVariablePointer |> JD.map RecordPattern )
                , ( "uncons", JD.map2 UnConsPattern (JD.field "left" decodePattern) (JD.field "right" decodePattern) )
                , ( "list", JD.list decodePattern |> JD.map ListPattern )
                , ( "var", decodeVariablePointer |> JD.map VarPattern )
                , ( "named", JD.map2 NamedPattern (JD.field "qualified" decodeQualifiedNameRef) (JD.field "patterns" (JD.list decodePattern)) )
                , ( "qualifiedName", JD.map QualifiedNamePattern decodeQualifiedNameRef )
                , ( "as", JD.map2 AsPattern (JD.field "pattern" decodePattern) (JD.field "name" decodeVariablePointer) )
                , ( "parentisized", JD.map ParentisizedPattern decodePattern )
                ]
        )


decodeQualifiedNameRef : Decoder QualifiedNameRef
decodeQualifiedNameRef =
    JD.succeed QualifiedNameRef
        |: JD.field "moduleName" decodeModuleName
        |: JD.field "name" JD.string
        |: JD.field "range" Ranges.decode


decodeExpression : Decoder Expression
decodeExpression =
    JD.lazy
        (\() ->
            JD.succeed (,)
                |: JD.field "range" Ranges.decode
                |: JD.field "inner" decodeInnerExpression
        )


decodeInnerExpression : Decoder InnerExpression
decodeInnerExpression =
    JD.lazy
        (\() ->
            decodeTyped
                [ ( "unit", JD.succeed UnitExpr )
                , ( "application", JD.list decodeExpression |> JD.map Application )
                , ( "operatorapplication", decodeOperatorApplication |> JD.map OperatorApplicationExpression )
                , ( "functionOrValue", JD.string |> JD.map FunctionOrValue )
                , ( "ifBlock", JD.map3 IfBlock (JD.field "clause" decodeExpression) (JD.field "then" decodeExpression) (JD.field "else" decodeExpression) )
                , ( "prefixoperator", JD.string |> JD.map PrefixOperator )
                , ( "operator", JD.string |> JD.map Operator )
                , ( "integer", JD.int |> JD.map Integer )
                , ( "float", JD.float |> JD.map Floatable )
                , ( "literal", JD.string |> JD.map Literal )
                , ( "charLiteral", decodeChar |> JD.map CharLiteral )
                , ( "tupled", JD.list decodeExpression |> JD.map TupledExpression )
                , ( "list", JD.list decodeExpression |> JD.map ListExpr )
                , ( "parenthesized", decodeExpression |> JD.map ParenthesizedExpression )
                , ( "let", decodeLetBlock |> JD.map LetExpression )
                , ( "case", decodeCaseBlock |> JD.map CaseExpression )
                , ( "lambda", decodeLambda |> JD.map LambdaExpression )
                , ( "qualified", JD.map2 QualifiedExpr (JD.field "moduleName" decodeModuleName) (JD.field "name" JD.string) )
                , ( "recordAccess", JD.map2 RecordAccess (JD.field "expression" decodeExpression) (JD.field "name" JD.string) )
                , ( "recordAccessFunction", JD.string |> JD.map RecordAccessFunction )
                , ( "record", JD.list decodeRecordSetter |> JD.map RecordExpr )
                , ( "recordUpdate", decodeRecordUpdate |> JD.map RecordUpdateExpression )
                , ( "glsl", JD.string |> JD.map GLSLExpression )
                ]
        )


decodeRecordUpdate : Decoder RecordUpdate
decodeRecordUpdate =
    JD.lazy
        (\() ->
            JD.succeed RecordUpdate
                |: JD.field "name" JD.string
                |: JD.field "updates" (JD.list decodeRecordSetter)
        )


decodeRecordSetter : Decoder RecordSetter
decodeRecordSetter =
    JD.lazy
        (\() ->
            JD.succeed (,)
                |: JD.field "field" JD.string
                |: JD.field "expression" decodeExpression
        )


decodeLambda : Decoder Lambda
decodeLambda =
    JD.lazy
        (\() ->
            JD.succeed Lambda
                |: JD.field "patterns" (JD.list decodePattern)
                |: JD.field "expression" decodeExpression
        )


decodeCaseBlock : Decoder CaseBlock
decodeCaseBlock =
    JD.lazy
        (\() ->
            JD.succeed CaseBlock
                |: JD.field "expression" decodeExpression
                |: JD.field "cases" (JD.list decodeCase)
        )


decodeCase : Decoder Case
decodeCase =
    JD.lazy
        (\() ->
            JD.succeed (,)
                |: JD.field "pattern" decodePattern
                |: JD.field "expression" decodeExpression
        )


decodeLetBlock : Decoder LetBlock
decodeLetBlock =
    JD.lazy
        (\() ->
            JD.succeed LetBlock
                |: JD.field "declarations" (JD.list decodeDeclaration)
                |: JD.field "expression" decodeExpression
        )


decodeOperatorApplication : Decoder OperatorApplication
decodeOperatorApplication =
    JD.lazy
        (\() ->
            JD.succeed OperatorApplication
                |: JD.field "operator" JD.string
                |: JD.field "direction" decodeInfixDirection
                |: JD.field "left" decodeExpression
                |: JD.field "left" decodeExpression
        )


decodeInfixDirection : Decoder InfixDirection
decodeInfixDirection =
    JD.string
        |> JD.andThen
            (\v ->
                case v of
                    "left" ->
                        JD.succeed Left

                    "right" ->
                        JD.succeed Right

                    _ ->
                        JD.fail "Invlalid direction"
            )



--
