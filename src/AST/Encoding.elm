module AST.Encoding exposing (encode)

import AST.Ranges as Ranges exposing (encode)
import AST.Types exposing (..)
import Json.Encode as JE exposing (Value)


asList : (a -> Value) -> List a -> Value
asList f =
    JE.list << List.map f


encode : File -> Value
encode { moduleDefinition, imports, declarations } =
    JE.object
        [ ( "moduleDefinition", encodeModule moduleDefinition )
        , ( "imports", asList encodeImport imports )
        , ( "declarations", asList encodeDeclaration declarations )
        ]


typed : String -> Value -> Value
typed x v =
    JE.object
        [ ( "type", JE.string x )
        , ( x, v )
        ]


encodeModule : Module -> Value
encodeModule m =
    case m of
        NormalModule d ->
            typed "normal" (encodeDefaultModuleData d)

        PortModule d ->
            typed "port" (encodeDefaultModuleData d)

        EffectModule d ->
            typed "effect" (encodeEffectModuleData d)

        NoModule ->
            typed "nomodule" (JE.null)


encodeEffectModuleData : EffectModuleData -> Value
encodeEffectModuleData { moduleName, exposingList, command, subscription } =
    JE.object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "exposingList", encodeExposingList exposingList encodeExpose )
        , ( "command", command |> Maybe.map JE.string |> Maybe.withDefault JE.null )
        , ( "subscription", subscription |> Maybe.map JE.string |> Maybe.withDefault JE.null )
        ]


encodeDefaultModuleData : DefaultModuleData -> Value
encodeDefaultModuleData { moduleName, exposingList } =
    JE.object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "exposingList", encodeExposingList exposingList encodeExpose )
        ]


encodeModuleName : ModuleName -> Value
encodeModuleName =
    List.map JE.string >> JE.list


encodeExpose : Expose -> Value
encodeExpose exp =
    case exp of
        InfixExpose x ->
            typed "infix" (JE.string x)

        DefinitionExpose x ->
            typed "definition" (JE.string x)

        TypeExpose x inner ->
            typed "type" <|
                JE.object
                    [ ( "name", JE.string x )
                    , ( "inner", encodeExposingList inner JE.string )
                    ]


encodeExposingList : Exposure a -> (a -> Value) -> Value
encodeExposingList exp f =
    case exp of
        None ->
            typed "none" <| JE.null

        All r ->
            typed "all" <| Ranges.encode r

        Explicit l ->
            typed "explicit" (asList f l)


encodeImport : Import -> Value
encodeImport { moduleName, moduleAlias, exposingList } =
    JE.object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "moduleAlias"
          , moduleAlias
                |> Maybe.map encodeModuleName
                |> Maybe.withDefault JE.null
          )
        , ( "exposingList", encodeExposingList exposingList encodeExpose )
        ]


encodeDeclaration : Declaration -> Value
encodeDeclaration decl =
    case decl of
        FuncDecl function ->
            typed "function" (encodeFunction function)

        AliasDecl typeAlias ->
            typed "typeAlias" (encodeTypeAlias typeAlias)

        TypeDecl typeDeclaration ->
            typed "type" (encodeType typeDeclaration)

        PortDeclaration sig ->
            typed "port" (encodeSignature sig)

        InfixDeclaration inf ->
            typed "infix"
                (JE.object
                    [ ( "direction", encodeInfixDirection inf.direction )
                    , ( "precedence", JE.int inf.precedence )
                    , ( "operator", JE.string inf.operator )
                    ]
                )

        DestructuringDeclaration x ->
            typed "destrucutring" (encodeDestructuring x)


encodeDestructuring : Destructuring -> Value
encodeDestructuring { pattern, expression } =
    JE.object
        [ ( "pattern", encodePattern pattern )
        , ( "expression", encodeExpression expression )
        ]


encodeType : Type -> Value
encodeType { name, generics, constructors } =
    JE.object
        [ ( "name", JE.string name )
        , ( "generics", asList JE.string generics )
        , ( "constructors", asList encodeValueConstructor constructors )
        ]


encodeValueConstructor : ValueConstructor -> Value
encodeValueConstructor { name, arguments, range } =
    JE.object
        [ ( "name", JE.string name )
        , ( "arguments", asList encodeTypeReference arguments )
        , ( "range", Ranges.encode range )
        ]


encodeTypeAlias : TypeAlias -> Value
encodeTypeAlias { name, generics, typeReference } =
    JE.object
        [ ( "name", JE.string name )
        , ( "generics", asList JE.string generics )
        , ( "typeReference", encodeTypeReference typeReference )
        ]


encodeFunction : Function -> Value
encodeFunction { documentation, signature, declaration } =
    JE.object
        [ ( "documentation", Maybe.map JE.string documentation |> Maybe.withDefault JE.null )
        , ( "signature", Maybe.map encodeSignature signature |> Maybe.withDefault JE.null )
        , ( "declaration", encodeFunctionDeclaration declaration )
        ]


encodeSignature : FunctionSignature -> Value
encodeSignature { operatorDefinition, name, typeReference } =
    JE.object
        [ ( "operatorDefinition", JE.bool operatorDefinition )
        , ( "name", JE.string name )
        , ( "typeReference", encodeTypeReference typeReference )
        ]


encodeTypeReference : TypeReference -> Value
encodeTypeReference typeReference =
    case typeReference of
        GenericType name ->
            JE.object
                [ ( "type", JE.string "generic" )
                , ( "name", JE.string name )
                ]

        Typed moduleName name args ->
            JE.object
                [ ( "type", JE.string "typed" )
                , ( "moduleName", encodeModuleName moduleName )
                , ( "name", JE.string name )
                , ( "args", asList encodeTypeArg args )
                ]

        Unit ->
            JE.object
                [ ( "type", JE.string "typed" ) ]

        Tupled t ->
            JE.object
                [ ( "type", JE.string "tupled" )
                , ( "values", asList encodeTypeReference t )
                ]

        FunctionTypeReference left right ->
            JE.object
                [ ( "type", JE.string "function" )
                , ( "left", encodeTypeReference left )
                , ( "right", encodeTypeReference right )
                ]

        Record recordDefinition ->
            JE.object
                [ ( "type", JE.string "record" )
                , ( "values", encodeRecordDefinition recordDefinition )
                ]

        GenericRecord name recordDefinition ->
            JE.object
                [ ( "type", JE.string "genericRecord" )
                , ( "name", JE.string name )
                , ( "values", encodeRecordDefinition recordDefinition )
                ]


encodeRecordDefinition : RecordDefinition -> Value
encodeRecordDefinition =
    JE.list << List.map encodeRecordField


encodeRecordField : RecordField -> Value
encodeRecordField ( name, ref ) =
    JE.object
        [ ( "name", JE.string name )
        , ( "typeReference", encodeTypeReference ref )
        ]


encodeTypeArg : TypeArg -> Value
encodeTypeArg typeArg =
    case typeArg of
        Generic name ->
            JE.object
                [ ( "type", JE.string "generic" )
                , ( "value", JE.string name )
                ]

        Concrete tr ->
            JE.object
                [ ( "type", JE.string "concrete" )
                , ( "value", encodeTypeReference tr )
                ]


encodeFunctionDeclaration : FunctionDeclaration -> Value
encodeFunctionDeclaration { operatorDefinition, name, arguments, expression } =
    JE.object
        [ ( "operatorDefinition", JE.bool operatorDefinition )
        , ( "name", encodeVariablePointer name )
        , ( "arguments", asList encodePattern arguments )
        , ( "expression", encodeExpression expression )
        ]


encodeVariablePointer : VariablePointer -> Value
encodeVariablePointer { value, range } =
    JE.object
        [ ( "value", JE.string value )
        , ( "range", Ranges.encode range )
        ]


typedJEObject : String -> List ( String, Value ) -> Value
typedJEObject k xs =
    ( "type", JE.string k ) :: xs |> JE.object


encodePattern : Pattern -> Value
encodePattern pattern =
    case pattern of
        AllPattern ->
            typedJEObject "all" []

        UnitPattern ->
            typedJEObject "unit" []

        CharPattern c ->
            typedJEObject "char" [ ( "value", JE.string <| String.fromChar c ) ]

        StringPattern v ->
            typedJEObject "string" [ ( "value", JE.string v ) ]

        IntPattern i ->
            typedJEObject "int" [ ( "value", JE.int i ) ]

        FloatPattern f ->
            typedJEObject "float" [ ( "value", JE.float f ) ]

        TuplePattern patterns ->
            typedJEObject "tuple" [ ( "value", asList encodePattern patterns ) ]

        RecordPattern pointers ->
            typedJEObject "record" [ ( "value", asList encodeVariablePointer pointers ) ]

        UnConsPattern p1 p2 ->
            typedJEObject "uncons"
                [ ( "left", encodePattern p1 )
                , ( "right", encodePattern p2 )
                ]

        ListPattern patterns ->
            typedJEObject "list" [ ( "value", asList encodePattern patterns ) ]

        VarPattern pointer ->
            typedJEObject "var" [ ( "value", encodeVariablePointer pointer ) ]

        NamedPattern qualifiedNameRef patterns ->
            typedJEObject "named"
                [ ( "qualified", encodeQualifiedNameRef qualifiedNameRef )
                , ( "patterns", asList encodePattern patterns )
                ]

        QualifiedNamePattern qualifiedNameRef ->
            typedJEObject "qualifiedName" [ ( "value", encodeQualifiedNameRef qualifiedNameRef ) ]

        AsPattern pattern variablePointer ->
            typedJEObject "named"
                [ ( "name", encodeVariablePointer variablePointer )
                , ( "pattern", encodePattern pattern )
                ]

        ParentisizedPattern p1 ->
            typedJEObject "parentisized" [ ( "value", encodePattern pattern ) ]


encodeQualifiedNameRef : QualifiedNameRef -> Value
encodeQualifiedNameRef (QualifiedNameRef moduleName name) =
    JE.object
        [ ( "moduleName", encodeModuleName moduleName )
        , ( "name", JE.string name )
        ]


encodeExpression : Expression -> Value
encodeExpression ( range, inner ) =
    JE.object
        [ ( "range", Ranges.encode range )
        , ( "inner"
          , case inner of
                UnitExpr ->
                    typedJEObject "unit" []

                Application l ->
                    typedJEObject "application"
                        [ ( "children", asList encodeExpression l ) ]

                OperatorApplicationExpression operatorApplication ->
                    typedJEObject "operatorapplication"
                        [ ( "value", encodeOperatorApplication operatorApplication ) ]

                FunctionOrValue x ->
                    typedJEObject "functionOrValue"
                        [ ( "value", JE.string x ) ]

                IfBlock c t e ->
                    typedJEObject "ifBlock"
                        [ ( "clause", encodeExpression c )
                        , ( "then", encodeExpression t )
                        , ( "else", encodeExpression e )
                        ]

                PrefixOperator x ->
                    typedJEObject "prefixoperator"
                        [ ( "value", JE.string x ) ]

                Operator x ->
                    typedJEObject "operator"
                        [ ( "value", JE.string x ) ]

                Integer x ->
                    typedJEObject "integer"
                        [ ( "value", JE.int x ) ]

                Floatable x ->
                    typedJEObject "float"
                        [ ( "value", JE.float x ) ]

                Literal x ->
                    typedJEObject "literal"
                        [ ( "value", JE.string x ) ]

                CharLiteral c ->
                    typedJEObject "charLiteral"
                        [ ( "value", JE.string <| String.fromChar c ) ]

                TupledExpression xs ->
                    typedJEObject "tupled"
                        [ ( "value", asList encodeExpression xs ) ]

                ListExpr xs ->
                    typedJEObject "list"
                        [ ( "value", asList encodeExpression xs ) ]

                ParenthesizedExpression x ->
                    typedJEObject "parenthesized"
                        [ ( "value", encodeExpression x ) ]

                LetExpression x ->
                    typedJEObject "let"
                        [ ( "value", encodeLetBlock x ) ]

                CaseExpression x ->
                    typedJEObject "case"
                        [ ( "value", encodeCaseBlock x ) ]

                LambdaExpression x ->
                    typedJEObject "lambda"
                        [ ( "value", encodeLambda x ) ]

                QualifiedExpr moduleName name ->
                    typedJEObject "qualified"
                        [ ( "moduleName", encodeModuleName moduleName )
                        , ( "name", JE.string name )
                        ]

                RecordAccess xs ->
                    typedJEObject "recordAccess"
                        [ ( "value", asList JE.string xs ) ]

                RecordAccessFunction x ->
                    typedJEObject "recordAccessFunction"
                        [ ( "value", JE.string x ) ]

                RecordExpr xs ->
                    typedJEObject "record"
                        [ ( "value", asList encodeRecordSetter xs ) ]

                RecordUpdateExpression recordUpdate ->
                    typedJEObject "recordUpdate"
                        [ ( "value", encodeRecordUpdate recordUpdate ) ]

                GLSLExpression x ->
                    typedJEObject "glsl"
                        [ ( "value", JE.string x ) ]
          )
        ]


encodeRecordUpdate : RecordUpdate -> Value
encodeRecordUpdate { name, updates } =
    JE.object
        [ ( "name", JE.string name )
        , ( "updates", asList encodeRecordSetter updates )
        ]


encodeRecordSetter : RecordSetter -> Value
encodeRecordSetter ( field, expression ) =
    JE.object
        [ ( "field", JE.string field )
        , ( "expression", encodeExpression expression )
        ]


encodeLambda : Lambda -> Value
encodeLambda { args, expression } =
    JE.object
        [ ( "pattern", asList encodePattern args )
        , ( "expression", encodeExpression expression )
        ]


encodeCaseBlock : CaseBlock -> Value
encodeCaseBlock { cases, expression } =
    JE.object
        [ ( "cases", asList encodeCase cases )
        , ( "expression", encodeExpression expression )
        ]


encodeCase : Case -> Value
encodeCase ( pattern, expression ) =
    JE.object
        [ ( "pattern", encodePattern pattern )
        , ( "expression", encodeExpression expression )
        ]


encodeLetBlock : LetBlock -> Value
encodeLetBlock { declarations, expression } =
    JE.object
        [ ( "declarations", asList encodeDeclaration declarations )
        , ( "expression", encodeExpression expression )
        ]


encodeOperatorApplication : OperatorApplication -> Value
encodeOperatorApplication { operator, direction, left, right } =
    JE.object
        [ ( "operator", JE.string operator )
        , ( "direction", encodeInfixDirection direction )
        , ( "left", encodeExpression left )
        , ( "right", encodeExpression right )
        ]


encodeInfixDirection : InfixDirection -> Value
encodeInfixDirection d =
    case d of
        Left ->
            JE.string "left"

        Right ->
            JE.string "right"
