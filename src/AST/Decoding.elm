module AST.Decoding exposing (decode, decodeInfix)

import AST.Ranges as Ranges exposing (Range)
import AST.Types exposing (..)
import Json.Decode exposing (Decoder, field, list, string, map, map2, map3, map4, succeed, maybe, lazy, int, bool, andThen, float, fail, at)
import Json.Decode.Extra exposing ((|:))
import Util.Json exposing (decodeTyped)


decodeTypedWithRange : List ( String, Decoder (Range -> a) ) -> Decoder a
decodeTypedWithRange opts =
    lazy
        (\() ->
            field "type" string
                |> andThen
                    (\t ->
                        case List.filter (Tuple.first >> (==) t) opts |> List.head of
                            Just m ->
                                (field (Tuple.first m) <| Tuple.second m)
                                    |: at [ Tuple.first m, "range" ] Ranges.decode

                            Nothing ->
                                fail ("No decoder for type: " ++ t)
                    )
        )


rangeField : Decoder Range
rangeField =
    field "range" Ranges.decode


nameField : Decoder String
nameField =
    field "name" string


decode : Decoder File
decode =
    succeed File
        |: field "moduleDefinition" decodeModule
        |: field "imports" (list decodeImport)
        |: field "declarations" (list decodeDeclaration)
        |: field "comments" (list decodeComment)


decodeComment : Decoder ( String, Range )
decodeComment =
    succeed (,)
        |: field "text" string
        |: field "range" Ranges.decode


decodeModule : Decoder Module
decodeModule =
    decodeTyped
        [ ( "normal", decodeDefaultModuleData |> map NormalModule )
        , ( "port", decodeDefaultModuleData |> map PortModule )
        , ( "effect", decodeEffectModuleData |> map EffectModule )
        , ( "nomodule", succeed NoModule )
        ]


decodeDefaultModuleData : Decoder DefaultModuleData
decodeDefaultModuleData =
    succeed DefaultModuleData
        |: field "moduleName" decodeModuleName
        |: field "exposingList" (decodeExposingList decodeExpose)


decodeEffectModuleData : Decoder EffectModuleData
decodeEffectModuleData =
    succeed EffectModuleData
        |: field "moduleName" decodeModuleName
        |: field "exposingList" (decodeExposingList decodeExpose)
        |: field "command" (maybe string)
        |: field "subscription" (maybe string)


decodeModuleName : Decoder ModuleName
decodeModuleName =
    list string


decodeExpose : Decoder Expose
decodeExpose =
    decodeTyped
        [ ( "infix", map2 InfixExpose nameField rangeField )
        , ( "function", map2 FunctionExpose nameField rangeField )
        , ( "typeOrAlias", map2 TypeOrAliasExpose nameField rangeField )
        , ( "typeexpose", map TypeExpose decodeExposedType )
        ]


decodeExposedType : Decoder ExposedType
decodeExposedType =
    succeed ExposedType
        |: nameField
        |: field "inner" (decodeExposingList decodeValueConstructorExpose)
        |: rangeField


decodeValueConstructorExpose : Decoder ValueConstructorExpose
decodeValueConstructorExpose =
    succeed (,)
        |: nameField
        |: rangeField


decodeExposingList : Decoder a -> Decoder (Exposure a)
decodeExposingList x =
    lazy
        (\() ->
            decodeTyped
                [ ( "none", succeed None )
                , ( "all", Ranges.decode |> map All )
                , ( "explicit", list x |> map Explicit )
                ]
        )


decodeImport : Decoder Import
decodeImport =
    succeed Import
        |: field "moduleName" decodeModuleName
        |: field "moduleAlias" (maybe decodeModuleName)
        |: field "exposingList" (decodeExposingList decodeExpose)
        |: rangeField


decodeDeclaration : Decoder Declaration
decodeDeclaration =
    lazy
        (\() ->
            decodeTyped
                [ ( "function", decodeFunction |> map FuncDecl )
                , ( "typeAlias", decodeTypeAlias |> map AliasDecl )
                , ( "typedecl", decodeType |> map TypeDecl )
                , ( "port", decodeSignature |> map PortDeclaration )
                , ( "infix", decodeInfix |> map InfixDeclaration )
                , ( "destrucutring", decodeDestructuring |> map DestructuringDeclaration )
                ]
        )


decodeInfix : Decoder Infix
decodeInfix =
    succeed Infix
        |: field "direction" decodeInfixDirection
        |: field "precedence" int
        |: field "operator" string


decodeDestructuring : Decoder Destructuring
decodeDestructuring =
    lazy
        (\() ->
            succeed Destructuring
                |: field "pattern" decodePattern
                |: field "expression" decodeExpression
        )


decodeType : Decoder Type
decodeType =
    succeed Type
        |: nameField
        |: field "generics" (list string)
        |: field "constructors" (list decodeValueConstructor)


decodeValueConstructor : Decoder ValueConstructor
decodeValueConstructor =
    succeed ValueConstructor
        |: nameField
        |: field "arguments" (list decodeTypeReference)
        |: rangeField


decodeTypeAlias : Decoder TypeAlias
decodeTypeAlias =
    succeed TypeAlias
        |: nameField
        |: field "generics" (list string)
        |: field "typeReference" decodeTypeReference
        |: rangeField


decodeFunction : Decoder Function
decodeFunction =
    lazy
        (\() ->
            succeed Function
                |: field "documentation" (maybe string)
                |: field "signature" (maybe decodeSignature)
                |: field "declaration" decodeFunctionDeclaration
        )


decodeSignature : Decoder FunctionSignature
decodeSignature =
    succeed FunctionSignature
        |: field "operatorDefinition" bool
        |: nameField
        |: field "typeReference" decodeTypeReference


decodeTypeReference : Decoder TypeReference
decodeTypeReference =
    lazy
        (\() ->
            decodeTyped
                [ ( "generic", map2 GenericType (field "value" string) rangeField )
                , ( "typed"
                  , map4 Typed
                        (field "moduleName" decodeModuleName)
                        nameField
                        (field "args" <| list decodeTypeArg)
                        rangeField
                  )
                , ( "unit", map Unit rangeField )
                , ( "tupled", map2 Tupled (field "values" (list decodeTypeReference)) rangeField )
                , ( "function"
                  , map3 FunctionTypeReference
                        (field "left" decodeTypeReference)
                        (field "right" decodeTypeReference)
                        rangeField
                  )
                , ( "record", map2 Record (field "value" decodeRecordDefinition) rangeField )
                , ( "genericRecord"
                  , map3 GenericRecord
                        nameField
                        (field "values" decodeRecordDefinition)
                        rangeField
                  )
                ]
        )


decodeRecordDefinition : Decoder RecordDefinition
decodeRecordDefinition =
    lazy (\() -> list decodeRecordField)


decodeRecordField : Decoder RecordField
decodeRecordField =
    lazy
        (\() ->
            succeed (,)
                |: nameField
                |: field "typeReference" decodeTypeReference
        )


decodeTypeArg : Decoder TypeArg
decodeTypeArg =
    lazy
        (\() ->
            decodeTyped
                [ ( "generic", string |> map Generic )
                , ( "concrete", decodeTypeReference |> map Concrete )
                ]
        )


decodeFunctionDeclaration : Decoder FunctionDeclaration
decodeFunctionDeclaration =
    lazy
        (\() ->
            succeed FunctionDeclaration
                |: field "operatorDefinition" bool
                |: field "name" decodeVariablePointer
                |: field "arguments" (list decodePattern)
                |: field "expression" decodeExpression
        )


decodeVariablePointer : Decoder VariablePointer
decodeVariablePointer =
    succeed VariablePointer
        |: field "value" string
        |: rangeField


decodeChar : Decoder Char
decodeChar =
    string
        |> andThen
            (\s ->
                case String.uncons s of
                    Just ( c, _ ) ->
                        succeed c

                    Nothing ->
                        fail "Not a char"
            )


decodePattern : Decoder Pattern
decodePattern =
    lazy
        (\() ->
            decodeTypedWithRange
                [ ( "all", succeed AllPattern )
                , ( "unit", succeed UnitPattern )
                , ( "char", field "value" decodeChar |> map CharPattern )
                , ( "string", field "value" string |> map StringPattern )
                , ( "int", field "value" int |> map IntPattern )
                , ( "float", field "value" float |> map FloatPattern )
                , ( "tuple", field "value" (list decodePattern) |> map TuplePattern )
                , ( "record", field "value" (list decodeVariablePointer) |> map RecordPattern )
                , ( "uncons", map2 UnConsPattern (field "left" decodePattern) (field "right" decodePattern) )
                , ( "list", field "value" (list decodePattern) |> map ListPattern )
                , ( "var", field "value" string |> map VarPattern )
                , ( "named", map2 NamedPattern (field "qualified" decodeQualifiedNameRef) (field "patterns" (list decodePattern)) )
                , ( "qualifiedName", map QualifiedNamePattern (field "value" decodeQualifiedNameRef) )
                , ( "as", map2 AsPattern (field "pattern" decodePattern) (field "name" decodeVariablePointer) )
                , ( "parentisized", map ParenthesizedPattern (field "value" decodePattern) )
                ]
        )


decodeQualifiedNameRef : Decoder QualifiedNameRef
decodeQualifiedNameRef =
    succeed QualifiedNameRef
        |: field "moduleName" decodeModuleName
        |: nameField


decodeExpression : Decoder Expression
decodeExpression =
    lazy
        (\() ->
            succeed (,)
                |: rangeField
                |: field "inner" decodeInnerExpression
        )


decodeInnerExpression : Decoder InnerExpression
decodeInnerExpression =
    lazy
        (\() ->
            decodeTyped
                [ ( "unit", succeed UnitExpr )
                , ( "application", list decodeExpression |> map Application )
                , ( "operatorapplication", decodeOperatorApplication )
                , ( "functionOrValue", string |> map FunctionOrValue )
                , ( "ifBlock", map3 IfBlock (field "clause" decodeExpression) (field "then" decodeExpression) (field "else" decodeExpression) )
                , ( "prefixoperator", string |> map PrefixOperator )
                , ( "operator", string |> map Operator )
                , ( "integer", int |> map Integer )
                , ( "float", float |> map Floatable )
                , ( "literal", string |> map Literal )
                , ( "charLiteral", decodeChar |> map CharLiteral )
                , ( "tupled", list decodeExpression |> map TupledExpression )
                , ( "list", list decodeExpression |> map ListExpr )
                , ( "parenthesized", decodeExpression |> map ParenthesizedExpression )
                , ( "let", decodeLetBlock |> map LetExpression )
                , ( "case", decodeCaseBlock |> map CaseExpression )
                , ( "lambda", decodeLambda |> map LambdaExpression )
                , ( "qualified", map2 QualifiedExpr (field "moduleName" decodeModuleName) nameField )
                , ( "recordAccess", map2 RecordAccess (field "expression" decodeExpression) nameField )
                , ( "recordAccessFunction", string |> map RecordAccessFunction )
                , ( "record", list decodeRecordSetter |> map RecordExpr )
                , ( "recordUpdate", decodeRecordUpdate |> map RecordUpdateExpression )
                , ( "glsl", string |> map GLSLExpression )
                ]
        )


decodeRecordUpdate : Decoder RecordUpdate
decodeRecordUpdate =
    lazy
        (\() ->
            succeed RecordUpdate
                |: nameField
                |: field "updates" (list decodeRecordSetter)
        )


decodeRecordSetter : Decoder RecordSetter
decodeRecordSetter =
    lazy
        (\() ->
            succeed (,)
                |: field "field" string
                |: field "expression" decodeExpression
        )


decodeLambda : Decoder Lambda
decodeLambda =
    lazy
        (\() ->
            succeed Lambda
                |: field "patterns" (list decodePattern)
                |: field "expression" decodeExpression
        )


decodeCaseBlock : Decoder CaseBlock
decodeCaseBlock =
    lazy
        (\() ->
            succeed CaseBlock
                |: field "expression" decodeExpression
                |: field "cases" (list decodeCase)
        )


decodeCase : Decoder Case
decodeCase =
    lazy
        (\() ->
            succeed (,)
                |: field "pattern" decodePattern
                |: field "expression" decodeExpression
        )


decodeLetBlock : Decoder LetBlock
decodeLetBlock =
    lazy
        (\() ->
            succeed LetBlock
                |: field "declarations" (list decodeDeclaration)
                |: field "expression" decodeExpression
        )


decodeOperatorApplication : Decoder InnerExpression
decodeOperatorApplication =
    lazy
        (\() ->
            succeed OperatorApplication
                |: field "operator" string
                |: field "direction" decodeInfixDirection
                |: field "left" decodeExpression
                |: field "right" decodeExpression
        )


decodeInfixDirection : Decoder InfixDirection
decodeInfixDirection =
    string
        |> andThen
            (\v ->
                case v of
                    "left" ->
                        succeed Left

                    "right" ->
                        succeed Right

                    _ ->
                        fail "Invlalid direction"
            )



--
