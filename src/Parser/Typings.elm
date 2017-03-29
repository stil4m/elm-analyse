module Parser.Typings exposing (typeDeclaration, typeAlias)

import Combine exposing (Parser, string, sepBy, many, succeed, (<*>), (*>))
import Parser.Tokens exposing (functionName, typeName)
import Parser.TypeReference exposing (typeReference)
import AST.Types exposing (Type, ValueConstructor, TypeAlias)
import Parser.Util exposing (moreThanIndentWhitespace, trimmed)
import Parser.State exposing (State)
import Parser.Ranges exposing (withRange)


typeDeclaration : Parser State Type
typeDeclaration =
    succeed Type
        <*> (typePrefix *> typeName)
        <*> genericList
        <*> (trimmed (string "=") *> valueConstructors)


valueConstructors : Parser State (List ValueConstructor)
valueConstructors =
    sepBy (string "|") (trimmed valueConstructor)


valueConstructor : Parser State ValueConstructor
valueConstructor =
    withRange
        (succeed ValueConstructor
            <*> typeName
            <*> many (moreThanIndentWhitespace *> typeReference)
        )


typeAlias : Parser State TypeAlias
typeAlias =
    withRange <|
        succeed (TypeAlias Nothing)
            <*> (typeAliasPrefix *> typeName)
            <*> genericList
            <*> (trimmed (string "=") *> typeReference)


genericList : Parser State (List String)
genericList =
    many (moreThanIndentWhitespace *> functionName)


typePrefix : Parser State ()
typePrefix =
    string "type" *> moreThanIndentWhitespace


typeAliasPrefix : Parser State ()
typeAliasPrefix =
    typePrefix *> string "alias" *> moreThanIndentWhitespace
