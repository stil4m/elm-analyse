module Parser.Patterns exposing (pattern, declarablePattern)

import Combine exposing (Parser, choice, lazy, between, string, sepBy, sepBy1, succeed, maybe, parens, many, or, (<$>), (<$), (<*), (<*>), (*>))
import Combine.Num
import Parser.Tokens exposing (characterLiteral, stringLiteral, asToken, functionName, typeName)
import AST.Types exposing (Pattern(ListPattern, UnConsPattern, CharPattern, StringPattern, IntPattern, FloatPattern, AsPattern, TuplePattern, RecordPattern, VarPattern, NamedPattern, QualifiedNamePattern, AllPattern, UnitPattern), QualifiedNameRef)
import Parser.Util exposing (moreThanIndentWhitespace, trimmed, asPointer)
import Parser.State exposing (State)
import Parser.Ranges exposing (withRange)


pattern : Parser State Pattern
pattern =
    lazy
        (\() ->
            choice
                [ unConsPattern
                , asPattern
                , declarablePattern
                , variablePattern
                , namedPattern
                ]
        )


nonNamedPattern : Parser State Pattern
nonNamedPattern =
    lazy
        (\() ->
            choice
                [ declarablePattern
                , asPattern
                , variablePattern
                ]
        )


nonConsPattern : Parser State Pattern
nonConsPattern =
    lazy
        (\() ->
            choice
                [ declarablePattern
                , asPattern
                , variablePattern
                , namedPattern
                ]
        )


nonAsPattern : Parser State Pattern
nonAsPattern =
    lazy
        (\() ->
            choice
                [ declarablePattern
                , variablePattern
                , namedPattern
                ]
        )


variablePattern : Parser State Pattern
variablePattern =
    lazy
        (\() ->
            choice [ allPattern, charPattern, stringPattern, floatPattern, intPattern, unitPattern, varPattern, listPattern ]
        )


declarablePattern : Parser State Pattern
declarablePattern =
    lazy
        (\() ->
            choice [ allPattern, tuplePattern, recordPattern ]
        )


listPattern : Parser State Pattern
listPattern =
    lazy
        (\() ->
            withRange <|
                between
                    (string "[")
                    (string "]")
                    (ListPattern <$> sepBy (string ",") (trimmed pattern))
        )


unConsPattern : Parser State Pattern
unConsPattern =
    lazy
        (\() ->
            withRange <|
                succeed UnConsPattern
                    <*> nonConsPattern
                    <*> (trimmed (string "::") *> pattern)
        )


charPattern : Parser State Pattern
charPattern =
    lazy (\() -> withRange <| (CharPattern <$> characterLiteral))


stringPattern : Parser State Pattern
stringPattern =
    lazy (\() -> withRange <| (StringPattern <$> stringLiteral))


intPattern : Parser State Pattern
intPattern =
    lazy (\() -> withRange (IntPattern <$> Combine.Num.int))


floatPattern : Parser State Pattern
floatPattern =
    lazy (\() -> withRange (FloatPattern <$> Combine.Num.float))


asPattern : Parser State Pattern
asPattern =
    lazy
        (\() ->
            withRange <|
                (succeed AsPattern
                    <*> (maybe moreThanIndentWhitespace *> nonAsPattern)
                    <*> (moreThanIndentWhitespace *> asToken *> moreThanIndentWhitespace *> asPointer functionName)
                )
        )


tuplePattern : Parser State Pattern
tuplePattern =
    lazy
        (\() ->
            withRange (TuplePattern <$> parens (sepBy1 (string ",") (trimmed pattern)))
        )


recordPattern : Parser State Pattern
recordPattern =
    lazy
        (\() ->
            withRange
                (RecordPattern
                    <$> between
                            (string "{" *> maybe moreThanIndentWhitespace)
                            (maybe moreThanIndentWhitespace *> string "}")
                            (sepBy1 (string ",") (trimmed (asPointer functionName)))
                )
        )


varPattern : Parser State Pattern
varPattern =
    lazy (\() -> withRange (VarPattern <$> functionName))


qualifiedNameRef : Parser State QualifiedNameRef
qualifiedNameRef =
    succeed QualifiedNameRef
        <*> many (typeName <* string ".")
        <*> typeName


qualifiedNamePattern : Parser State Pattern
qualifiedNamePattern =
    withRange (QualifiedNamePattern <$> qualifiedNameRef)


namedPattern : Parser State Pattern
namedPattern =
    lazy
        (\() ->
            withRange
                (succeed NamedPattern
                    <*> qualifiedNameRef
                    <*> many (moreThanIndentWhitespace *> or qualifiedNamePattern nonNamedPattern)
                )
        )


allPattern : Parser State Pattern
allPattern =
    lazy (\() -> withRange (AllPattern <$ string "_"))


unitPattern : Parser State Pattern
unitPattern =
    lazy (\() -> withRange (UnitPattern <$ string "()"))
