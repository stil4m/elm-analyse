module Parser.Typings exposing (..)

import Combine exposing (..)
import Parser.Tokens exposing (functionName, typeName)
import Parser.TypeReference exposing (typeReference)
import AST.Types exposing (..)
import Parser.Util exposing (moreThanIndentWhitespace, trimmed, withRange)


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
    succeed TypeAlias
        <*> (typeAliasPrefix *> typeName)
        <*> genericList
        <*> (trimmed (string "=") *> typeReference)


genericList : Parser State (List String)
genericList =
    many (moreThanIndentWhitespace *> functionName)


typePrefix : Parser State String
typePrefix =
    string "type" *> moreThanIndentWhitespace


typeAliasPrefix : Parser State String
typeAliasPrefix =
    typePrefix *> string "alias" *> moreThanIndentWhitespace
