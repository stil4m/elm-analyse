module Analyser.Fixes.UnusedTypeAlias exposing (fixer)

import Analyser.Checks.UnusedTypeAlias as UnusedTypeAliasCheck
import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Analyser.Messages.Range as Range exposing (Range)
import Elm.Syntax.Declaration exposing (..)
import Elm.Syntax.File exposing (..)
import Elm.Syntax.Range as Syntax
import Elm.Syntax.TypeAlias exposing (..)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| UnusedTypeAliasCheck.checker) fix "Remove type alias and format"


fix : ( String, File ) -> MessageData -> Result String String
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            findAndRemoveTypeAlias input range
                |> Result.fromMaybe "Could not find type alias"

        _ ->
            Err "Invalid message data for fixer UnusedTypeAlias"


findAndRemoveTypeAlias : ( String, File ) -> Range -> Maybe String
findAndRemoveTypeAlias ( content, file ) range =
    findTypeAlias range file
        |> Maybe.map (\typeAlias -> removeTypeAlias typeAlias content)


findTypeAlias : Range -> File -> Maybe TypeAlias
findTypeAlias range file =
    file.declarations
        |> List.filterMap
            (\decl ->
                case decl of
                    AliasDecl typeAlias ->
                        if typeAlias.range == Range.asSyntaxRange range then
                            Just typeAlias
                        else
                            Nothing

                    _ ->
                        Nothing
            )
        |> List.head


removeTypeAlias : TypeAlias -> String -> String
removeTypeAlias typeAlias content =
    let
        start =
            typeAlias.documentation
                |> Maybe.map (.range >> .start)
                |> Maybe.withDefault typeAlias.range.start

        end =
            typeAlias.range.end
    in
    FileContent.replaceRangeWith (Syntax.Range start end) "" content
