module Analyser.Fixes.UnusedTypeAlias exposing (fixer)

import Analyser.Fixes.Base exposing (Fixer)
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Range as Range exposing (Range)
import Analyser.Messages.Types exposing (MessageData(UnusedTypeAlias))
import Elm.Syntax.Declaration exposing (..)
import Elm.Syntax.File exposing (..)
import Elm.Syntax.Range as Syntax
import Elm.Syntax.TypeAlias exposing (..)


fixer : Fixer
fixer =
    Fixer canFix fix


canFix : MessageData -> Bool
canFix message =
    case message of
        UnusedTypeAlias _ _ _ ->
            True

        _ ->
            False


fix : List ( String, String, File ) -> MessageData -> Result String (List ( String, String ))
fix input messageData =
    case messageData of
        UnusedTypeAlias _ _ range ->
            case List.head input of
                Nothing ->
                    Err "No input for fixer UnusedTypeAlias"

                Just triple ->
                    findAndRemoveTypeAlias triple range
                        |> Maybe.map List.singleton
                        |> Result.fromMaybe "Could not find type alias"

        _ ->
            Err "Invalid message data for fixer UnusedTypeAlias"


findAndRemoveTypeAlias : ( String, String, File ) -> Range -> Maybe ( String, String )
findAndRemoveTypeAlias ( name, content, file ) range =
    findTypeAlias range file
        |> Maybe.map (\typeAlias -> ( name, removeTypeAlias typeAlias content ))


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
