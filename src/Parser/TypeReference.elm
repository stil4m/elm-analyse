module Parser.TypeReference exposing (..)

import Combine exposing (..)
import Parser.Tokens exposing (functionName, typeName)
import Parser.Types exposing (..)
import Parser.Util exposing (moreThanIndentWhitespace, trimmed)


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
                , parens typeReference
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
    succeed Function
        <*> typeReferenceNoFn
        <*> (maybe moreThanIndentWhitespace *> string "->" *> maybe moreThanIndentWhitespace *> typeReference)


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
            RecordDefinition <$> sepBy (string ",") (maybe moreThanIndentWhitespace *> recordFieldDefinition <* maybe moreThanIndentWhitespace)
        )


genericRecordTypeReference : Parser State TypeReference
genericRecordTypeReference =
    lazy
        (\() ->
            between
                (string "{")
                (string "}")
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
                (string "}")
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
