module Parser.Patterns exposing (..)

import Combine exposing (..)
import Combine.Num
import Parser.Tokens exposing (..)
import AST.Types exposing (..)
import Parser.Util exposing (exactIndentWhitespace, moreThanIndentWhitespace, trimmed, withRange)


asPointer : Parser State String -> Parser State VariablePointer
asPointer p =
    withRange (VariablePointer <$> p)


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
            between
                (string "[")
                (string "]")
                (ListPattern <$> (sepBy (string ",") (trimmed pattern)))
        )


unConsPattern : Parser State Pattern
unConsPattern =
    lazy
        (\() ->
            succeed UnConsPattern
                <*> nonConsPattern
                <*> (trimmed (string "::") *> pattern)
        )


charPattern : Parser State Pattern
charPattern =
    lazy (\() -> CharPattern <$> characterLiteral)


stringPattern : Parser State Pattern
stringPattern =
    lazy (\() -> StringPattern <$> stringLiteral)


intPattern : Parser State Pattern
intPattern =
    lazy (\() -> IntPattern <$> Combine.Num.int)


floatPattern : Parser State Pattern
floatPattern =
    lazy (\() -> FloatPattern <$> Combine.Num.float)


asPattern : Parser State Pattern
asPattern =
    lazy
        (\() ->
            (succeed AsPattern
                <*> (maybe moreThanIndentWhitespace *> nonAsPattern)
                <*> (moreThanIndentWhitespace *> asToken *> moreThanIndentWhitespace *> asPointer functionName)
            )
        )


tuplePattern : Parser State Pattern
tuplePattern =
    lazy
        (\() ->
            TuplePattern <$> parens (sepBy1 (string ",") (trimmed pattern))
        )


recordPattern : Parser State Pattern
recordPattern =
    lazy
        (\() ->
            RecordPattern
                <$> between
                        (string "{" *> maybe moreThanIndentWhitespace)
                        (maybe moreThanIndentWhitespace *> string "}")
                        (sepBy1 (string ",") (trimmed (asPointer functionName)))
        )


varPattern : Parser State Pattern
varPattern =
    lazy (\() -> VarPattern <$> asPointer functionName)


qualifiedNameRef : Parser s QualifiedNameRef
qualifiedNameRef =
    succeed QualifiedNameRef
        <*> many (typeName <* string ".")
        <*> typeName


qualifiedNamePattern : Parser s Pattern
qualifiedNamePattern =
    QualifiedNamePattern <$> qualifiedNameRef


namedPattern : Parser State Pattern
namedPattern =
    lazy
        (\() ->
            succeed NamedPattern
                <*> qualifiedNameRef
                <*> many (moreThanIndentWhitespace *> (or qualifiedNamePattern nonNamedPattern))
        )


allPattern : Parser State Pattern
allPattern =
    lazy (\() -> AllPattern <$ string "_")


unitPattern : Parser State Pattern
unitPattern =
    lazy (\() -> UnitPattern <$ string "()")
