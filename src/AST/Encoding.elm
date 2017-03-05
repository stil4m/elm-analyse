module AST.Encoding exposing (encode, encodeInfix)

import AST.Ranges as Ranges exposing (Range)
import AST.Types exposing (..)
import Json.Encode as JE exposing (Value, object, int, string, list, float)
import Util.Json exposing (encodeTyped)


asList : (a -> Value) -> List a -> Value
asList f =
    list << List.map f


nameField : String -> ( String, Value )
nameField x =
    ( "name", string x )


rangeField : Range -> ( String, Value )
rangeField r =
    ( "range", Ranges.encode r )


encode : File -> Value
encode { moduleDefinition, imports, declarations, comments } =
    object
        [ ( "moduleDefinition", encodeModule moduleDefinition )
        , ( "imports", asList encodeImport imports )
        , ( "declarations", asList encodeDeclaration declarations )
        , ( "comments", asList encodeComment comments )
        ]


encodeComment : ( String, Range ) -> Value
encodeComment ( text, range ) =
    object
        [ ( "text", string text )
        , rangeField range
        ]


encodeModule : Module -> Value
encodeModule m =
    case m of
        NormalModule d ->
            encodeTyped "normal" (encodeDefaultModuleData d)

        PortModule d ->
            encodeTyped "port" (encodeDefaultModuleData d)

        EffectModule d ->
            encodeTyped "effect" (encodeEffectModuleData d)

        NoModule ->
            encodeTyped "nomodule" JE.null


encodeEffectModuleData : EffectModuleData -> Value
encodeEffectModuleData { moduleName, exposingList, command, subscription } =
    object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "exposingList", encodeExposingList exposingList encodeExpose )
        , ( "command", command |> Maybe.map string |> Maybe.withDefault JE.null )
        , ( "subscription", subscription |> Maybe.map string |> Maybe.withDefault JE.null )
        ]


encodeDefaultModuleData : DefaultModuleData -> Value
encodeDefaultModuleData { moduleName, exposingList } =
    object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "exposingList", encodeExposingList exposingList encodeExpose )
        ]


encodeModuleName : ModuleName -> Value
encodeModuleName =
    List.map string >> list


encodeExpose : Expose -> Value
encodeExpose exp =
    case exp of
        InfixExpose x r ->
            encodeTyped "infix" <|
                object
                    [ nameField x
                    , (rangeField r)
                    ]

        FunctionExpose x r ->
            encodeTyped "function" <|
                object
                    [ nameField x
                    , (rangeField r)
                    ]

        TypeOrAliasExpose x r ->
            encodeTyped "typeOrAlias" <|
                object
                    [ nameField x
                    , (rangeField r)
                    ]

        TypeExpose exposedType ->
            encodeTyped "typeexpose" (encodeExposedType exposedType)


encodeExposedType : ExposedType -> Value
encodeExposedType { name, constructors, range } =
    object
        [ (nameField name)
        , ( "inner", encodeExposingList constructors encodeValueConstructorExpose )
        , (rangeField range)
        ]


encodeValueConstructorExpose : ValueConstructorExpose -> Value
encodeValueConstructorExpose ( name, range ) =
    object
        [ (nameField name)
        , (rangeField range)
        ]


encodeExposingList : Exposure a -> (a -> Value) -> Value
encodeExposingList exp f =
    case exp of
        None ->
            encodeTyped "none" <| JE.null

        All r ->
            encodeTyped "all" <| Ranges.encode r

        Explicit l ->
            encodeTyped "explicit" (asList f l)


encodeImport : Import -> Value
encodeImport { moduleName, moduleAlias, exposingList, range } =
    object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "moduleAlias"
          , moduleAlias
                |> Maybe.map encodeModuleName
                |> Maybe.withDefault JE.null
          )
        , ( "exposingList", encodeExposingList exposingList encodeExpose )
        , (rangeField range)
        ]


encodeDeclaration : Declaration -> Value
encodeDeclaration decl =
    case decl of
        FuncDecl function ->
            encodeTyped "function" (encodeFunction function)

        AliasDecl typeAlias ->
            encodeTyped "typeAlias" (encodeTypeAlias typeAlias)

        TypeDecl typeDeclaration ->
            encodeTyped "typedecl" (encodeType typeDeclaration)

        PortDeclaration sig ->
            encodeTyped "port" (encodeSignature sig)

        InfixDeclaration inf ->
            encodeTyped "infix"
                (encodeInfix inf)

        DestructuringDeclaration x ->
            encodeTyped "destrucutring" (encodeDestructuring x)


encodeInfix : Infix -> Value
encodeInfix inf =
    object
        [ ( "direction", encodeInfixDirection inf.direction )
        , ( "precedence", int inf.precedence )
        , ( "operator", string inf.operator )
        ]


encodeDestructuring : Destructuring -> Value
encodeDestructuring { pattern, expression } =
    object
        [ ( "pattern", encodePattern pattern )
        , ( "expression", encodeExpression expression )
        ]


encodeType : Type -> Value
encodeType { name, generics, constructors } =
    object
        [ (nameField name)
        , ( "generics", asList string generics )
        , ( "constructors", asList encodeValueConstructor constructors )
        ]


encodeValueConstructor : ValueConstructor -> Value
encodeValueConstructor { name, arguments, range } =
    object
        [ (nameField name)
        , ( "arguments", asList encodeTypeReference arguments )
        , (rangeField range)
        ]


encodeTypeAlias : TypeAlias -> Value
encodeTypeAlias { name, generics, typeReference, range } =
    object
        [ (nameField name)
        , ( "generics", asList string generics )
        , ( "typeReference", encodeTypeReference typeReference )
        , (rangeField range)
        ]


encodeFunction : Function -> Value
encodeFunction { documentation, signature, declaration } =
    object
        [ ( "documentation", Maybe.map encodeDocumentation documentation |> Maybe.withDefault JE.null )
        , ( "signature", Maybe.map encodeSignature signature |> Maybe.withDefault JE.null )
        , ( "declaration", encodeFunctionDeclaration declaration )
        ]


encodeDocumentation : DocumentationComment -> Value
encodeDocumentation ( text, range ) =
    object
        [ ( "value", string text )
        , rangeField range
        ]


encodeSignature : FunctionSignature -> Value
encodeSignature { operatorDefinition, name, typeReference, range } =
    object
        [ ( "operatorDefinition", JE.bool operatorDefinition )
        , (nameField name)
        , ( "typeReference", encodeTypeReference typeReference )
        , rangeField range
        ]


encodeTypeReference : TypeReference -> Value
encodeTypeReference typeReference =
    case typeReference of
        GenericType name r ->
            encodeTyped "generic" <|
                object
                    [ ( "value", string name )
                    , rangeField r
                    ]

        Typed moduleName name args r ->
            encodeTyped "typed" <|
                object
                    [ ( "moduleName", encodeModuleName moduleName )
                    , nameField name
                    , ( "args", asList encodeTypeArg args )
                    , rangeField r
                    ]

        Unit r ->
            encodeTyped "unit" <|
                object
                    [ rangeField r ]

        Tupled t r ->
            encodeTyped "tupled" <|
                object
                    [ ( "values", asList encodeTypeReference t )
                    , rangeField r
                    ]

        FunctionTypeReference left right r ->
            encodeTyped "function" <|
                object
                    [ ( "left", encodeTypeReference left )
                    , ( "right", encodeTypeReference right )
                    , rangeField r
                    ]

        Record recordDefinition r ->
            encodeTyped "record" <|
                object
                    [ ( "value", encodeRecordDefinition recordDefinition )
                    , rangeField r
                    ]

        GenericRecord name recordDefinition r ->
            encodeTyped "genericRecord" <|
                object
                    [ (nameField name)
                    , ( "values", encodeRecordDefinition recordDefinition )
                    , rangeField r
                    ]


encodeRecordDefinition : RecordDefinition -> Value
encodeRecordDefinition =
    list << List.map encodeRecordField


encodeRecordField : RecordField -> Value
encodeRecordField ( name, ref ) =
    object
        [ (nameField name)
        , ( "typeReference", encodeTypeReference ref )
        ]


encodeTypeArg : TypeArg -> Value
encodeTypeArg typeArg =
    case typeArg of
        Generic name ->
            encodeTyped "generic" (string name)

        Concrete tr ->
            encodeTyped "concrete" (encodeTypeReference tr)


encodeFunctionDeclaration : FunctionDeclaration -> Value
encodeFunctionDeclaration { operatorDefinition, name, arguments, expression } =
    object
        [ ( "operatorDefinition", JE.bool operatorDefinition )
        , ( "name", encodeVariablePointer name )
        , ( "arguments", asList encodePattern arguments )
        , ( "expression", encodeExpression expression )
        ]


encodeVariablePointer : VariablePointer -> Value
encodeVariablePointer { value, range } =
    object
        [ ( "value", string value )
        , (rangeField range)
        ]


encodePattern : Pattern -> Value
encodePattern pattern =
    case pattern of
        AllPattern r ->
            encodeTyped "all" (JE.object [ ( "range", Ranges.encode r ) ])

        UnitPattern r ->
            encodeTyped "unit" (JE.object [ ( "range", Ranges.encode r ) ])

        CharPattern c r ->
            encodeTyped "char"
                (JE.object
                    [ ( "value", string <| String.fromChar c )
                    , ( "range", Ranges.encode r )
                    ]
                )

        StringPattern v r ->
            encodeTyped "char"
                (JE.object
                    [ ( "value", string v )
                    , ( "range", Ranges.encode r )
                    ]
                )

        IntPattern i r ->
            encodeTyped "int"
                (JE.object
                    [ ( "value", JE.int i )
                    , ( "range", Ranges.encode r )
                    ]
                )

        FloatPattern f r ->
            encodeTyped "float"
                (JE.object
                    [ ( "value", float f )
                    , ( "range", Ranges.encode r )
                    ]
                )

        TuplePattern patterns r ->
            encodeTyped "tuple"
                (JE.object
                    [ ( "value", asList encodePattern patterns )
                    , ( "range", Ranges.encode r )
                    ]
                )

        RecordPattern pointers r ->
            encodeTyped "record"
                (JE.object
                    [ ( "value", asList encodeVariablePointer pointers )
                    , ( "range", Ranges.encode r )
                    ]
                )

        UnConsPattern p1 p2 r ->
            encodeTyped "uncons"
                (object
                    [ ( "left", encodePattern p1 )
                    , ( "right", encodePattern p2 )
                    , ( "range", Ranges.encode r )
                    ]
                )

        ListPattern patterns r ->
            encodeTyped "list"
                (JE.object
                    [ ( "value", asList encodePattern patterns )
                    , ( "range", Ranges.encode r )
                    ]
                )

        VarPattern name r ->
            encodeTyped "var"
                (JE.object
                    [ ( "value", string name )
                    , ( "range", Ranges.encode r )
                    ]
                )

        NamedPattern qualifiedNameRef patterns r ->
            encodeTyped "named" <|
                object
                    [ ( "qualified", encodeQualifiedNameRef qualifiedNameRef )
                    , ( "patterns", asList encodePattern patterns )
                    , ( "range", Ranges.encode r )
                    ]

        QualifiedNamePattern qualifiedNameRef r ->
            encodeTyped "qualifiedName" <|
                JE.object
                    [ ( "value", encodeQualifiedNameRef qualifiedNameRef )
                    , ( "range", Ranges.encode r )
                    ]

        AsPattern destructured variablePointer r ->
            encodeTyped "as" <|
                object
                    [ ( "name", encodeVariablePointer variablePointer )
                    , ( "pattern", encodePattern destructured )
                    , ( "range", Ranges.encode r )
                    ]

        ParenthesizedPattern p1 r ->
            encodeTyped "parentisized"
                (JE.object
                    [ ( "value", encodePattern p1 )
                    , ( "range", Ranges.encode r )
                    ]
                )


encodeQualifiedNameRef : QualifiedNameRef -> Value
encodeQualifiedNameRef { moduleName, name } =
    object
        [ ( "moduleName", encodeModuleName moduleName )
        , (nameField name)
        ]


encodeExpression : Expression -> Value
encodeExpression ( range, inner ) =
    object
        [ (rangeField range)
        , ( "inner"
          , case inner of
                UnitExpr ->
                    encodeTyped "unit" JE.null

                Application l ->
                    encodeTyped "application" (asList encodeExpression l)

                OperatorApplication op dir left right ->
                    encodeTyped "operatorapplication" (encodeOperatorApplication op dir left right)

                FunctionOrValue x ->
                    encodeTyped "functionOrValue" (string x)

                IfBlock c t e ->
                    encodeTyped "ifBlock" <|
                        object
                            [ ( "clause", encodeExpression c )
                            , ( "then", encodeExpression t )
                            , ( "else", encodeExpression e )
                            ]

                PrefixOperator x ->
                    encodeTyped "prefixoperator" (string x)

                Operator x ->
                    encodeTyped "operator" (string x)

                Integer x ->
                    encodeTyped "integer" (int x)

                Floatable x ->
                    encodeTyped "float" (float x)

                Literal x ->
                    encodeTyped "literal" (string x)

                CharLiteral c ->
                    encodeTyped "charLiteral" (string <| String.fromChar c)

                TupledExpression xs ->
                    encodeTyped "tupled" (asList encodeExpression xs)

                ListExpr xs ->
                    encodeTyped "list" (asList encodeExpression xs)

                ParenthesizedExpression x ->
                    encodeTyped "parenthesized" (encodeExpression x)

                LetExpression x ->
                    encodeTyped "let" <| encodeLetBlock x

                CaseExpression x ->
                    encodeTyped "case" <| encodeCaseBlock x

                LambdaExpression x ->
                    encodeTyped "lambda" <| encodeLambda x

                QualifiedExpr moduleName name ->
                    encodeTyped "qualified" <|
                        object
                            [ ( "moduleName", encodeModuleName moduleName )
                            , (nameField name)
                            ]

                RecordAccess exp name ->
                    encodeTyped "recordAccess" <|
                        object
                            [ ( "expression", encodeExpression exp )
                            , (nameField name)
                            ]

                RecordAccessFunction x ->
                    encodeTyped "recordAccessFunction" (string x)

                RecordExpr xs ->
                    encodeTyped "record" (asList encodeRecordSetter xs)

                RecordUpdateExpression recordUpdate ->
                    encodeTyped "recordUpdate" (encodeRecordUpdate recordUpdate)

                GLSLExpression x ->
                    encodeTyped "glsl" (string x)
          )
        ]


encodeRecordUpdate : RecordUpdate -> Value
encodeRecordUpdate { name, updates } =
    object
        [ (nameField name)
        , ( "updates", asList encodeRecordSetter updates )
        ]


encodeRecordSetter : RecordSetter -> Value
encodeRecordSetter ( field, expression ) =
    object
        [ ( "field", string field )
        , ( "expression", encodeExpression expression )
        ]


encodeLambda : Lambda -> Value
encodeLambda { args, expression } =
    object
        [ ( "patterns", asList encodePattern args )
        , ( "expression", encodeExpression expression )
        ]


encodeCaseBlock : CaseBlock -> Value
encodeCaseBlock { cases, expression } =
    object
        [ ( "cases", asList encodeCase cases )
        , ( "expression", encodeExpression expression )
        ]


encodeCase : Case -> Value
encodeCase ( pattern, expression ) =
    object
        [ ( "pattern", encodePattern pattern )
        , ( "expression", encodeExpression expression )
        ]


encodeLetBlock : LetBlock -> Value
encodeLetBlock { declarations, expression } =
    object
        [ ( "declarations", asList encodeDeclaration declarations )
        , ( "expression", encodeExpression expression )
        ]


encodeOperatorApplication : String -> InfixDirection -> Expression -> Expression -> Value
encodeOperatorApplication operator direction left right =
    object
        [ ( "operator", string operator )
        , ( "direction", encodeInfixDirection direction )
        , ( "left", encodeExpression left )
        , ( "right", encodeExpression right )
        ]


encodeInfixDirection : InfixDirection -> Value
encodeInfixDirection d =
    case d of
        Left ->
            string "left"

        Right ->
            string "right"
