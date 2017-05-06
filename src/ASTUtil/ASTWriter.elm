module ASTUtil.ASTWriter exposing (..)

import AST.Ranges exposing (Range)
import AST.Types exposing (..)
import ASTUtil.Writer exposing (..)
import ASTUtil.Expose
import List.Extra as List


write : Writer -> String
write =
    ASTUtil.Writer.write


writeFile : File -> Writer
writeFile file =
    breaked
        [ writeModule file.moduleDefinition
        , breaked (List.map writeImport file.imports)
        , breaked (List.map writeDeclaration file.declarations)
        ]


writeModule : Module -> Writer
writeModule m =
    case m of
        NormalModule defaultModuleData ->
            writeDefaultModuleData defaultModuleData

        PortModule defaultModuleData ->
            spaced
                [ string "port"
                , writeDefaultModuleData defaultModuleData
                ]

        EffectModule effectModuleData ->
            writeEffectModuleData effectModuleData

        NoModule ->
            epsilon


writeDefaultModuleData : DefaultModuleData -> Writer
writeDefaultModuleData { moduleName, exposingList } =
    spaced
        [ string "module"
        , writeModuleName moduleName
        , writeExposureExpose exposingList
        ]


writeEffectModuleData : EffectModuleData -> Writer
writeEffectModuleData { moduleName, exposingList, command, subscription } =
    spaced
        [ string "effect"
        , string "module"
        , writeModuleName moduleName
        , writeWhere ( command, subscription )
        , writeExposureExpose exposingList
        ]


writeWhere : ( Maybe String, Maybe String ) -> Writer
writeWhere input =
    case input of
        ( Nothing, Nothing ) ->
            epsilon

        ( Just x, Nothing ) ->
            spaced
                [ string "where { command ="
                , string x
                , string "}"
                ]

        ( Nothing, Just x ) ->
            spaced
                [ string "where { subscription ="
                , string x
                , string "}"
                ]

        ( Just x, Just y ) ->
            spaced
                [ string "where { command ="
                , string x
                , string ", subscription ="
                , string y
                , string "}"
                ]


writeModuleName : ModuleName -> Writer
writeModuleName moduleName =
    string (String.join "." moduleName)


writeExposureExpose : Exposure Expose -> Writer
writeExposureExpose x =
    spaced
        [ string "exposing"
        , case x of
            None ->
                epsilon

            All _ ->
                string "(..)"

            Explicit exposeList ->
                let
                    diffLines =
                        List.map ASTUtil.Expose.range exposeList
                            |> startOnDifferentLines
                in
                    parensComma diffLines (List.map writeExpose exposeList)
        ]


writeExpose : Expose -> Writer
writeExpose exp =
    case exp of
        InfixExpose x _ ->
            string ("(" ++ x ++ ")")

        FunctionExpose f _ ->
            string f

        TypeOrAliasExpose t _ ->
            string t

        TypeExpose { name, constructors } ->
            spaced
                [ string name
                , writeExposureValueConstructor constructors
                ]


writeExposureValueConstructor : Exposure ValueConstructorExpose -> Writer
writeExposureValueConstructor x =
    case x of
        None ->
            epsilon

        All _ ->
            string "(..)"

        Explicit exposeList ->
            let
                diffLines =
                    List.map Tuple.second exposeList
                        |> startOnDifferentLines
            in
                parensComma diffLines (List.map (Tuple.first >> string) exposeList)


startOnDifferentLines : List Range -> Bool
startOnDifferentLines xs =
    List.length (List.unique (List.map (.start >> .row) xs)) > 1


writeImport : Import -> Writer
writeImport { moduleName, moduleAlias, exposingList } =
    spaced
        [ string "import"
        , writeModuleName moduleName
        , maybe (Maybe.map (writeModuleName >> \x -> spaced [ string "as", x ]) moduleAlias)
        , writeExposureExpose exposingList
        ]


writeDeclaration : Declaration -> Writer
writeDeclaration decl =
    case decl of
        FuncDecl function ->
            writeFunction function

        AliasDecl typeAlias ->
            writeTypeAlias typeAlias

        TypeDecl type_ ->
            writeType type_

        PortDeclaration p ->
            writePortDeclaration p

        InfixDeclaration i ->
            writeInfix i

        DestructuringDeclaration d ->
            writeDestructuring d


writeFunction : Function -> Writer
writeFunction { documentation, signature, declaration } =
    breaked
        [ maybe (Maybe.map writeDocumentation documentation)
        , maybe (Maybe.map writeSignature signature)
        , writeFunctionDeclaration declaration
        ]


writeFunctionDeclaration : FunctionDeclaration -> Writer
writeFunctionDeclaration declaration =
    breaked
        [ spaced
            [ if declaration.operatorDefinition then
                string ("(" ++ declaration.name.value ++ ")")
              else
                string declaration.name.value
            , spaced (List.map writePattern declaration.arguments)
            , string "="
            ]
        , indent 4 (writeExpression declaration.expression)
        ]


writeSignature : FunctionSignature -> Writer
writeSignature signature =
    spaced
        [ if signature.operatorDefinition then
            string ("(" ++ signature.name ++ ")")
          else
            string signature.name
        , string ":"
        , writeTypeReference signature.typeReference
        ]


writeDocumentation : DocumentationComment -> Writer
writeDocumentation =
    Tuple.first >> string


writeTypeAlias : TypeAlias -> Writer
writeTypeAlias typeAlias =
    breaked
        [ spaced
            [ string "type alias"
            , string typeAlias.name
            , spaced (List.map string typeAlias.generics)
            , string "="
            ]
        , indent 4 (writeTypeReference typeAlias.typeReference)
        ]


writeType : Type -> Writer
writeType type_ =
    breaked
        [ spaced
            [ string "type"
            , string type_.name
            , spaced (List.map string type_.generics)
            , string "="
            ]
        , let
            diffLines =
                List.map .range type_.constructors
                    |> startOnDifferentLines
          in
            sepBy ( "=", "|", "" )
                diffLines
                (List.map writeValueConstructor type_.constructors)
        ]


writeValueConstructor : ValueConstructor -> Writer
writeValueConstructor { name, arguments } =
    spaced
        [ string name
        , spaced (List.map writeTypeReference arguments)
        ]


writePortDeclaration : FunctionSignature -> Writer
writePortDeclaration signature =
    spaced [ string "port", writeSignature signature ]


writeInfix : Infix -> Writer
writeInfix { direction, precedence, operator } =
    spaced
        [ case direction of
            Left ->
                string "infixl"

            Right ->
                string "infixr"
        , string (toString precedence)
        , string operator
        ]


writeDestructuring : Destructuring -> Writer
writeDestructuring { pattern, expression } =
    breaked
        [ spaced [ writePattern pattern, string "=" ]
        , indent 4 (writeExpression expression)
        ]


writeTypeReference : TypeReference -> Writer
writeTypeReference typeReference =
    case typeReference of
        GenericType s _ ->
            string s

        Typed moduleName k args _ ->
            spaced
                [ join [ writeModuleName moduleName, string k ]
                , spaced (List.map writeTypeReference args)
                ]

        Unit _ ->
            string "()"

        Tupled xs _ ->
            parensComma False (List.map writeTypeReference xs)

        Record xs _ ->
            bracesComma False (List.map writeRecordField xs)

        GenericRecord name fields _ ->
            spaced
                [ string "{"
                , string name
                , string "|"
                , sepByComma False (List.map writeRecordField fields)
                , string "}"
                ]

        FunctionTypeReference left right _ ->
            spaced
                [ writeTypeReference left
                , string "->"
                , writeTypeReference right
                ]


writeRecordField : RecordField -> Writer
writeRecordField ( name, ref ) =
    spaced
        [ string name
        , string ":"
        , writeTypeReference ref
        ]


writeExpression : Expression -> Writer
writeExpression ( range, inner ) =
    let
        recurRangeHelper =
            \( x, y ) -> ( x, writeExpression ( x, y ) )

        writeRecordSetter ( name, expr ) =
            ( Tuple.first expr
            , spaced [ string name, string "=", writeExpression expr ]
            )

        sepHelper : (Bool -> List Writer -> Writer) -> List ( Range, Writer ) -> Writer
        sepHelper f l =
            let
                diffLines =
                    List.map Tuple.first l
                        |> startOnDifferentLines
            in
                f diffLines (List.map Tuple.second l)
    in
        case inner of
            UnitExpr ->
                string "()"

            Application xs ->
                case xs of
                    [] ->
                        epsilon

                    [ x ] ->
                        writeExpression x

                    x :: rest ->
                        spaced
                            [ writeExpression x
                            , sepHelper sepBySpace (List.map recurRangeHelper rest)
                            ]

            OperatorApplication x dir left right ->
                case dir of
                    Left ->
                        sepHelper sepBySpace
                            [ ( Tuple.first left, writeExpression left )
                            , ( range, spaced [ string x, writeExpression right ] )
                            ]

                    Right ->
                        sepHelper sepBySpace
                            [ ( Tuple.first left, spaced [ writeExpression left, string x ] )
                            , ( Tuple.first right, writeExpression right )
                            ]

            FunctionOrValue x ->
                string x

            IfBlock condition thenCase elseCase ->
                breaked
                    [ spaced [ string "if", writeExpression condition, string "then" ]
                    , indent 2 (writeExpression thenCase)
                    , string "else"
                    , indent 2 (writeExpression elseCase)
                    ]

            PrefixOperator x ->
                string ("(" ++ x ++ ")")

            Operator x ->
                string x

            Integer i ->
                string (toString i)

            Floatable f ->
                string (toString f)

            Negation x ->
                append (string "-") (writeExpression x)

            Literal s ->
                string (toString s)

            CharLiteral c ->
                string (toString c)

            TupledExpression t ->
                sepHelper sepByComma (List.map recurRangeHelper t)

            ParenthesizedExpression x ->
                join [ string "(", writeExpression x, string ")" ]

            LetExpression letBlock ->
                breaked
                    [ string "let"
                    , indent 2 (breaked (List.map writeDeclaration letBlock.declarations))
                    , string "in"
                    , indent 2 (writeExpression letBlock.expression)
                    ]

            CaseExpression caseBlock ->
                let
                    writeCaseBranch ( pattern, expression ) =
                        breaked
                            [ spaced [ writePattern pattern, string "->" ]
                            , indent 2 (writeExpression expression)
                            ]
                in
                    breaked
                        [ spaced [ string "case", writeExpression caseBlock.expression, string "of" ]
                        , indent 2
                            (breaked (List.map writeCaseBranch caseBlock.cases))
                        ]

            LambdaExpression lambda ->
                spaced
                    [ join
                        [ string "\\"
                        , spaced (List.map writePattern lambda.args)
                        ]
                    , string "->"
                    , writeExpression lambda.expression
                    ]

            RecordExpr setters ->
                sepHelper bracesComma (List.map writeRecordSetter setters)

            ListExpr xs ->
                sepHelper bracketsComma (List.map recurRangeHelper xs)

            QualifiedExpr moduleName name ->
                join [ writeModuleName moduleName, string name ]

            RecordAccess expression accessor ->
                join [ writeExpression expression, string ".", string accessor ]

            RecordAccessFunction s ->
                join [ string ".", string s ]

            RecordUpdateExpression { name, updates } ->
                spaced
                    [ string "{"
                    , string name
                    , string "|"
                    , sepHelper sepByComma (List.map writeRecordSetter updates)
                    , string "}"
                    ]

            GLSLExpression s ->
                join
                    [ string "[glsl|"
                    , string s
                    , string "|]"
                    ]


writePattern : Pattern -> Writer
writePattern p =
    case p of
        AllPattern _ ->
            string "_"

        UnitPattern _ ->
            string "()"

        CharPattern c _ ->
            string (toString c)

        StringPattern s _ ->
            string s

        IntPattern i _ ->
            string (toString i)

        FloatPattern f _ ->
            string (toString f)

        TuplePattern inner _ ->
            parensComma False (List.map writePattern inner)

        RecordPattern inner _ ->
            bracesComma False (List.map (.value >> string) inner)

        UnConsPattern left right _ ->
            spaced [ writePattern left, string "::", writePattern right ]

        ListPattern inner _ ->
            bracketsComma False (List.map writePattern inner)

        VarPattern var _ ->
            string var

        NamedPattern qnr others _ ->
            spaced
                [ writeQualifiedNameRef qnr
                , spaced (List.map writePattern others)
                ]

        QualifiedNamePattern qnr _ ->
            writeQualifiedNameRef qnr

        AsPattern innerPattern asName _ ->
            spaced [ writePattern innerPattern, string "as", string asName.value ]

        ParenthesizedPattern innerPattern _ ->
            spaced [ string "(", writePattern innerPattern, string ")" ]


writeQualifiedNameRef : QualifiedNameRef -> Writer
writeQualifiedNameRef { moduleName, name } =
    case moduleName of
        [] ->
            string name

        _ ->
            join
                [ writeModuleName moduleName
                , string "."
                , string name
                ]
