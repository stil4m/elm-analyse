module Parser.Declarations exposing (..)

import Combine exposing (..)
import Combine.Char exposing (anyChar, char, noneOf)
import Combine.Num
import List.Extra as List
import Parser.Imports exposing (importDefinition)
import Parser.Infix as Infix
import Parser.Modules exposing (moduleDefinition)
import Parser.Patterns exposing (..)
import Parser.Tokens exposing (..)
import Parser.TypeReference exposing (..)
import AST.Types exposing (..)
import Parser.Typings exposing (typeDeclaration)
import Parser.Util exposing (exactIndentWhitespace, moreThanIndentWhitespace, nextChar, nextChars, trimmed, unstrictIndentWhitespace)
import Parser.Whitespace exposing (manySpaces)


file : Parser State File
file =
    ((maybe exactIndentWhitespace) *> moduleDefinition)
        >>= (\modDef ->
                let
                    importParser =
                        case modDef of
                            NoModule ->
                                maybe exactIndentWhitespace *> sepBy exactIndentWhitespace importDefinition

                            _ ->
                                (many (exactIndentWhitespace *> importDefinition))
                in
                    succeed (File modDef)
                        <*> importParser
                        <*> ((many (exactIndentWhitespace *> declaration)) <* maybe exactIndentWhitespace <* manySpaces)
            )


declaration : Parser State Declaration
declaration =
    lazy
        (\() ->
            choice
                [ AliasDecl <$> Parser.Typings.typeAlias
                , FuncDecl <$> function
                , TypeDecl <$> typeDeclaration
                , portDeclaration
                , infixDeclaration
                , destructuringDeclaration
                ]
        )


function : Parser State Function
function =
    lazy
        (\() ->
            succeed Function
                <*> succeed Nothing
                <*> (maybe (signature <* exactIndentWhitespace))
                <*> functionDeclaration
        )


infixDeclaration : Parser State Declaration
infixDeclaration =
    lazy
        (\() ->
            InfixDeclaration <$> Infix.infixDefinition
        )


destructuringDeclaration : Parser State Declaration
destructuringDeclaration =
    lazy
        (\() ->
            succeed Destructuring
                <*> declarablePattern
                <*> (moreThanIndentWhitespace *> string "=" *> moreThanIndentWhitespace *> expression)
        )


portDeclaration : Parser State Declaration
portDeclaration =
    portToken *> lazy (\() -> PortDeclaration <$> (moreThanIndentWhitespace *> signature))


signature : Parser State FunctionSignature
signature =
    succeed FunctionSignature
        <*> (lookAhead anyChar >>= (\c -> succeed (c == '(')))
        <*> (or functionName (parens prefixOperatorToken))
        <*> (trimmed (string ":") *> maybe moreThanIndentWhitespace *> typeReference)


functionDeclaration : Parser State FunctionDeclaration
functionDeclaration =
    lazy
        (\() ->
            succeed FunctionDeclaration
                <*> (lookAhead anyChar >>= (\c -> succeed (c == '(')))
                <*> (or functionName (parens prefixOperatorToken))
                <*> (many (moreThanIndentWhitespace *> functionArgument))
                <*> (maybe moreThanIndentWhitespace
                        *> string "="
                        *> maybe moreThanIndentWhitespace
                        *> expression
                    )
        )


functionArgument : Parser State Pattern
functionArgument =
    pattern



-- Expressions


expressionNotApplication : Parser State Expression
expressionNotApplication =
    lazy
        (\() ->
            choice
                [ unitExpression
                , qualifiedExpression
                , recordAccessExpression
                , functionOrValueExpression
                , ifBlockExpression
                , tupledExpression
                , prefixOperatorExpression
                , recordAccessFunctionExpression
                , operatorExpression
                , floatableExpression
                , integerExpression
                , letExpression
                , lambdaExpression
                , literalExpression
                , charLiteralExpression
                , recordExpression
                , recordUpdateExpression
                , glslExpression
                , listExpression
                , caseExpression
                ]
        )


expression : Parser State Expression
expression =
    lazy
        (\() ->
            expressionNotApplication
                >>= (\expr ->
                        or (promoteToApplicationExpression expr)
                            (succeed expr)
                    )
        )


promoteToApplicationExpression : Expression -> Parser State Expression
promoteToApplicationExpression expr =
    lazy
        (\() ->
            succeed (\rest -> Application (expr :: rest))
                <*> (lazy (\() -> (many1 (maybe moreThanIndentWhitespace *> expressionNotApplication))))
        )


applicationExpression : Parser State Expression
applicationExpression =
    lazy
        (\() ->
            succeed (\x rest -> Application (x :: rest))
                <*> (lazy (\() -> expressionNotApplication))
                <*> (lazy (\() -> (many1 (maybe moreThanIndentWhitespace *> expressionNotApplication))))
        )



-- End expression


modIndent : Int -> Parser State a -> Parser State a
modIndent x p =
    (modifyState (pushIndent x) *> p)
        <* modifyState popIndent


withIndentedState : Parser State a -> Parser State a
withIndentedState p =
    withLocation
        (\location ->
            (modifyState (pushIndent (location.column + 1)) *> p)
                <* modifyState popIndent
        )


withIndentedState2 : Parser State a -> Parser State a
withIndentedState2 p =
    withLocation
        (\location ->
            let
                x =
                    location.source
                        |> String.toList
                        |> List.takeWhile ((==) ' ')
                        |> List.length
            in
                ((modifyState (pushIndent x) *> p)
                    <* modifyState popIndent
                )
        )


unitExpression : Parser State Expression
unitExpression =
    UnitExpr <$ string "()"


glslExpression : Parser State Expression
glslExpression =
    (String.fromList >> GLSLExpression)
        <$> (between (string "[glsl|")
                (string "|]")
                (many
                    (lookAhead (String.fromList <$> count 2 anyChar)
                        >>= (\s ->
                                if s == "|]" then
                                    fail "end symbol"
                                else
                                    anyChar
                            )
                    )
                )
            )



-- listExpression


listExpression : Parser State Expression
listExpression =
    lazy
        (\() ->
            ListExpr
                -- Not sure on this or
                <$>
                    (or ([] <$ (string "[" *> (maybe (or moreThanIndentWhitespace exactIndentWhitespace)) *> string "]"))
                        (between
                            (string "[")
                            (string "]")
                            (sepBy (string ",")
                                (trimmed expression)
                            )
                        )
                    )
        )



-- recordExpression


recordExpressionField : Parser State ( String, Expression )
recordExpressionField =
    lazy
        (\() ->
            succeed (,)
                <*> functionName
                <*> (maybe moreThanIndentWhitespace
                        *> (string "=")
                        *> (maybe moreThanIndentWhitespace)
                        *> expression
                    )
        )


recordFields : Bool -> Parser State (List ( String, Expression ))
recordFields oneOrMore =
    let
        p =
            if oneOrMore then
                sepBy1
            else
                sepBy
    in
        p (string ",") (trimmed recordExpressionField)


recordExpression : Parser State Expression
recordExpression =
    lazy
        (\() ->
            RecordExpr
                <$> (between (string "{")
                        (string "}")
                        (recordFields False)
                    )
        )


recordUpdateExpression : Parser State Expression
recordUpdateExpression =
    lazy
        (\() ->
            (between (string "{")
                (string "}")
                (succeed RecordUpdate
                    <*> (trimmed functionName)
                    <*> (string "|" *> recordFields True)
                )
            )
        )



-- literalExpression


literalExpression : Parser State Expression
literalExpression =
    Literal <$> or multiLineStringLiteral stringLiteral


charLiteralExpression : Parser State Expression
charLiteralExpression =
    CharLiteral <$> characterLiteral



-- lambda


lambdaExpression : Parser State Expression
lambdaExpression =
    lazy
        (\() ->
            succeed Lambda
                <*> (string "\\" *> maybe moreThanIndentWhitespace *> (sepBy1 moreThanIndentWhitespace functionArgument))
                <*> (trimmed (string "->") *> expression)
        )



-- Case Expression


caseBlock : Parser State Expression
caseBlock =
    lazy (\() -> caseToken *> moreThanIndentWhitespace *> expression <* moreThanIndentWhitespace <* ofToken)


caseStatement : Parser State Case
caseStatement =
    lazy
        (\() ->
            succeed (,)
                <*> pattern
                <*> (maybe (or moreThanIndentWhitespace exactIndentWhitespace) *> string "->" *> maybe moreThanIndentWhitespace *> expression)
        )


caseStatements : Parser State Cases
caseStatements =
    lazy (\() -> sepBy1 exactIndentWhitespace caseStatement)


caseExpression : Parser State Expression
caseExpression =
    lazy
        (\() ->
            -- withIndentedState
            (succeed CaseBlock
                <*> caseBlock
                <*> (moreThanIndentWhitespace *> withIndentedState caseStatements)
            )
        )



-- Let Expression


letBody : Parser State (List Declaration)
letBody =
    lazy
        (\() ->
            sepBy1 exactIndentWhitespace (or destructuringDeclaration (FuncDecl <$> function))
        )


letBlock : Parser State (List Declaration)
letBlock =
    lazy
        (\() ->
            ((string "let" *> (moreThanIndentWhitespace))
                *> withIndentedState letBody
                <* (choice
                        [ unstrictIndentWhitespace
                        , manySpaces
                        ]
                        *> string "in"
                   )
            )
        )


letExpression : Parser State Expression
letExpression =
    lazy
        (\() ->
            (succeed LetBlock
                <*> (withIndentedState2 letBlock)
                <*> (moreThanIndentWhitespace *> expression)
            )
        )


integerExpression : Parser State Expression
integerExpression =
    Integer <$> Combine.Num.int


floatableExpression : Parser State Expression
floatableExpression =
    Floatable <$> Combine.Num.float


ifBlockExpression : Parser State Expression
ifBlockExpression =
    ((ifToken)
        *> lazy
            (\() ->
                succeed IfBlock
                    <*> (trimmed expression)
                    <*> (thenToken *> trimmed expression)
                    <*> (elseToken *> moreThanIndentWhitespace *> expression)
            )
    )


prefixOperatorExpression : Parser State Expression
prefixOperatorExpression =
    PrefixOperator <$> (parens prefixOperatorToken)


operatorExpression : Parser State Expression
operatorExpression =
    Operator <$> infixOperatorToken


functionOrValueExpression : Parser State Expression
functionOrValueExpression =
    lazy
        (\() ->
            FunctionOrValue <$> choice [ functionName, typeName ]
        )


qualifiedExpression : Parser State Expression
qualifiedExpression =
    lazy
        (\() ->
            succeed QualifiedExpr
                <*> many1 (typeName <* string ".")
                <*> choice [ functionName, typeName ]
        )


recordAccessFunctionExpression : Parser State Expression
recordAccessFunctionExpression =
    ((++) "." >> RecordAccessFunction) <$> (string "." *> functionName)


recordAccessExpression : Parser State Expression
recordAccessExpression =
    lazy
        (\() ->
            succeed RecordAccess
                <*> (succeed (::)
                        <*> functionName
                        <*> (many1 (string "." *> functionName))
                    )
        )


tupledExpression : Parser State Expression
tupledExpression =
    lazy
        (\() ->
            (\l ->
                case l of
                    [ x ] ->
                        Parentesized x

                    xs ->
                        TupledExpression xs
            )
                <$> parens (sepBy1 (string ",") (trimmed expression))
        )
