module Parser.TypeReference exposing (typeReference, tupledTypeReference)

-- TODO Export for test. Failing when use first

import Combine exposing (..)
import Parser.Tokens exposing (functionName, typeName)
import AST.Types exposing (..)
import Parser.Util exposing (moreThanIndentWhitespace, trimmed)
import Parser.Whitespace exposing (realNewLine)


typeReferenceNoFn : Parser State TypeReference
typeReferenceNoFn =
    lazy
        (\() ->
            choice
                [ unitTypeReference
                , tupledTypeReference
                , typedTypeReference
                , recordTypeReference
                , genericRecordTypeReference
                , genericTypeReference
                , parens (trimmed typeReference)
                ]
        )


typeReference : Parser State TypeReference
typeReference =
    lazy
        (\() ->
            choice
                [ functionTypeReference
                , typeReferenceNoFn
                ]
        )


functionTypeReference : Parser State TypeReference
functionTypeReference =
    succeed FunctionTypeReference
        <*> typeReferenceNoFn
        <*> (trimmed (string "->") *> typeReference)


unitTypeReference : Parser State TypeReference
unitTypeReference =
    always Unit <$> (string "(" *> maybe moreThanIndentWhitespace *> string ")")


tupledTypeReference : Parser State TypeReference
tupledTypeReference =
    lazy
        (\() ->
            Tupled
                <$> parens
                        (succeed (::)
                            <*> (trimmed typeReference)
                            <*> (many1 (string "," *> trimmed typeReference))
                        )
        )


genericTypeReference : Parser State TypeReference
genericTypeReference =
    lazy
        (\() ->
            GenericType <$> functionName
        )


recordFieldsTypeReference : Parser State RecordDefinition
recordFieldsTypeReference =
    lazy
        (\() ->
            RecordDefinition <$> sepBy (string ",") (trimmed recordFieldDefinition)
        )


genericRecordTypeReference : Parser State TypeReference
genericRecordTypeReference =
    lazy
        (\() ->
            between
                (string "{")
                (maybe realNewLine *> string "}")
                (succeed GenericRecord
                    <*> (maybe whitespace *> functionName)
                    <*> (maybe whitespace *> string "|" *> maybe whitespace *> recordFieldsTypeReference)
                )
        )


recordTypeReference : Parser State TypeReference
recordTypeReference =
    lazy
        (\() ->
            between
                (string "{")
                (maybe realNewLine *> string "}")
                (Record <$> recordFieldsTypeReference)
        )


recordFieldDefinition : Parser State RecordField
recordFieldDefinition =
    lazy
        (\() ->
            succeed (,)
                <*> (maybe moreThanIndentWhitespace *> functionName)
                <*> (maybe moreThanIndentWhitespace *> string ":" *> maybe moreThanIndentWhitespace *> typeReference)
        )


typedTypeReference : Parser State TypeReference
typedTypeReference =
    lazy
        (\() ->
            succeed Typed
                <*> many (typeName <* string ".")
                <*> typeName
                <*> (Maybe.withDefault [] <$> maybe (moreThanIndentWhitespace *> sepBy moreThanIndentWhitespace typeArg))
        )


typeArg : Parser State TypeArg
typeArg =
    lazy
        (\() ->
            or
                (Generic <$> functionName)
                (Concrete <$> typeReferenceNoFn)
        )
