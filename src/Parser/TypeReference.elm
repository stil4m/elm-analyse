module Parser.TypeReference exposing (typeReference)

import Combine exposing (choice, lazy, Parser, parens, map, sepBy, (<*>), succeed, (*>), string, maybe, many1, (<$>), sepBy, between, many, (<*), or, whitespace)
import Parser.Tokens exposing (functionName, typeName)
import AST.Types exposing (TypeReference(FunctionTypeReference, Unit, Tupled, GenericType, GenericRecord, Record, Typed), RecordField, RecordDefinition, TypeArg(Generic, Concrete))
import Parser.Util exposing (moreThanIndentWhitespace, trimmed)
import Parser.Whitespace exposing (realNewLine)
import Parser.State exposing (State)


typeReferenceNoFn : Parser State TypeReference
typeReferenceNoFn =
    lazy
        (\() ->
            choice
                [ parensTypeReference
                  -- , unitTypeReference
                  -- , tupledTypeReference
                , typedTypeReference
                , recordTypeReference
                , genericRecordTypeReference
                , genericTypeReference
                  -- , parens (trimmed typeReference)
                ]
        )


parensTypeReference : Parser State TypeReference
parensTypeReference =
    lazy
        (\() ->
            parens (maybe moreThanIndentWhitespace *> sepBy (string ",") (trimmed typeReference))
                |> map
                    (\x ->
                        case x of
                            [] ->
                                Unit

                            [ x ] ->
                                x

                            xs ->
                                Tupled xs
                    )
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



-- unitTypeReference : Parser State TypeReference
-- unitTypeReference =
--     always Unit <$> (string "(" *> maybe moreThanIndentWhitespace *> string ")")
--
-- tupledTypeReference : Parser State TypeReference
-- tupledTypeReference =
--     lazy
--         (\() ->
--             Tupled
--                 <$> parens
--                         (succeed (::)
--                             <*> trimmed typeReference
--                             <*> many1 (string "," *> trimmed typeReference)
--                         )
--         )


genericTypeReference : Parser State TypeReference
genericTypeReference =
    lazy (\() -> GenericType <$> functionName)


recordFieldsTypeReference : Parser State RecordDefinition
recordFieldsTypeReference =
    lazy (\() -> sepBy (string ",") (trimmed recordFieldDefinition))


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
