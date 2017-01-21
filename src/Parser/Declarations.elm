module Parser.Declarations exposing (..)

import Combine exposing (..)
import Combine.Num
import Parser.Imports exposing (importDefinition)
import Parser.Infix as Infix exposing (Infix)
import Parser.Modules exposing (moduleDefinition)
import Parser.Patterns exposing (..)
import Parser.Tokens exposing (..)
import Parser.TypeReference exposing (..)
import Parser.Types exposing (..)
import Parser.Typings exposing (typeDeclaration)
import Parser.Util exposing (exactIndentWhitespace, moreThanIndentWhitespace)


type alias File =
    { moduleDefinition : Module
    , imports : List Import
    , declarations : List Declaration
    }


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
                        <*> ((many (exactIndentWhitespace *> declaration)) <* maybe whitespace)
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


type alias FunctionSignature =
    { name : String
    , typeReference : TypeReference
    }


type Declaration
    = FuncDecl Function
    | AliasDecl TypeAlias
    | TypeDecl Type
    | PortDeclaration FunctionSignature
    | InfixDeclaration Infix
    | Destructuring Pattern Expression


type alias FunctionDeclaration =
    { name : String
    , arguments : List Pattern
    , expression : Expression
    }


type alias Function =
    { documentation : Maybe DocumentationComment
    , signature : Maybe FunctionSignature
    , declaration : FunctionDeclaration
    }


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
    lazy (\() -> PortDeclaration <$> (portToken *> moreThanIndentWhitespace *> signature))


signature : Parser State FunctionSignature
signature =
    succeed FunctionSignature
        <*> functionName
        <*> (maybe moreThanIndentWhitespace *> string ":" *> maybe moreThanIndentWhitespace *> typeReference)


functionDeclaration : Parser State FunctionDeclaration
functionDeclaration =
    lazy
        (\() ->
            succeed FunctionDeclaration
                <*> functionName
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



-- Expression


type Expression
    = UnitExpr
    | Application (List Expression)
    | FunctionOrValue String
    | IfBlock Expression Expression Expression
    | PrefixOperator String
    | Operator String
    | Integer Int
    | Floatable Float
    | Literal String
    | CharLiteral Char
    | TupledExpression (List Expression)
    | Parentesized Expression
    | LetBlock (List Declaration) Expression
    | CaseBlock Expression Cases
    | Lambda (List Pattern) Expression
    | RecordExpr (List ( String, Expression ))
    | ListExpr (List Expression)
    | QualifiedExpr ModuleName String
    | RecordAccess (List String)
    | RecordUpdate String (List ( String, Expression ))


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
                , operatorExpression
                , floatableExpression
                , integerExpression
                , letExpression
                , lambdaExpression
                , literalExpression
                , charLiteralExpression
                , recordExpression
                , recordUpdateExpression
                , listExpression
                , caseExpression
                ]
        )


expression : Parser State Expression
expression =
    lazy
        (\() ->
            or applicationExpression
                expressionNotApplication
        )


withIndentedState : Parser State a -> Parser State a
withIndentedState p =
    withLocation
        (\location ->
            ((modifyState (pushIndent (location.column + 1)) *> p)
                <* modifyState popIndent
            )
        )


unitExpression : Parser State Expression
unitExpression =
    UnitExpr <$ string "()"



-- listExpression


listExpression : Parser State Expression
listExpression =
    lazy
        (\() ->
            ListExpr
                -- Not sure on this or
                <$>
                    (or (always [] <$> (string "[" *> (maybe (or moreThanIndentWhitespace exactIndentWhitespace)) *> string "]"))
                        (between
                            (string "[")
                            (string "]")
                            (sepBy (string ",")
                                (maybe moreThanIndentWhitespace *> expression <* maybe moreThanIndentWhitespace)
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
        p (string ",")
            (maybe moreThanIndentWhitespace *> recordExpressionField <* maybe moreThanIndentWhitespace)


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
                    <*> (moreThanIndentWhitespace *> functionName)
                    <*> (moreThanIndentWhitespace *> string "|" *> recordFields True)
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
                <*> (maybe moreThanIndentWhitespace *> string "->" *> maybe moreThanIndentWhitespace *> expression)
        )



-- Case Expression


type alias Case =
    ( Pattern, Expression )


type alias Cases =
    List Case


caseBlock : Parser State Expression
caseBlock =
    lazy (\() -> caseToken *> moreThanIndentWhitespace *> expression <* moreThanIndentWhitespace <* ofToken)


caseStatement : Parser State Case
caseStatement =
    lazy
        (\() ->
            succeed (,)
                <*> pattern
                <*> (moreThanIndentWhitespace *> string "->" *> moreThanIndentWhitespace *> expression)
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
            sepBy1 exactIndentWhitespace declaration
        )


letBlock : Parser State (List Declaration)
letBlock =
    lazy
        (\() ->
            (string "let"
                *> moreThanIndentWhitespace
                *> withIndentedState letBody
            )
        )


inBlock : Parser State Expression
inBlock =
    lazy (\() -> string "in" *> moreThanIndentWhitespace *> expression)


letExpression : Parser State Expression
letExpression =
    lazy
        (\() ->
            withIndentedState
                (succeed LetBlock
                    <*> letBlock
                    <*> (exactIndentWhitespace *> inBlock)
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
    lazy
        (\() ->
            succeed IfBlock
                <*> (ifToken *> moreThanIndentWhitespace *> expression)
                <*> (moreThanIndentWhitespace *> thenToken *> moreThanIndentWhitespace *> expression)
                <*> (moreThanIndentWhitespace *> elseToken *> moreThanIndentWhitespace *> expression)
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
                <*> (ModuleName <$> many1 (typeName <* string "."))
                <*> choice [ functionName, typeName ]
        )


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
                <$> parens (sepBy1 (string ",") (maybe moreThanIndentWhitespace *> expression <* maybe moreThanIndentWhitespace))
        )


applicationExpression : Parser State Expression
applicationExpression =
    lazy
        (\() ->
            succeed (\x rest -> Application (x :: rest))
                <*> (lazy (\() -> expressionNotApplication))
                <*> (lazy (\() -> (many1 (maybe moreThanIndentWhitespace *> expressionNotApplication))))
        )
