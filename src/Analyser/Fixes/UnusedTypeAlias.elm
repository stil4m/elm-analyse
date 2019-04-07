module Analyser.Fixes.UnusedTypeAlias exposing (fixer)

import Analyser.Checks.UnusedTypeAlias as UnusedTypeAliasCheck
import Analyser.Fixes.Base exposing (Fixer, Patch(..))
import Analyser.Fixes.FileContent as FileContent
import Analyser.Messages.Data as Data exposing (MessageData)
import Elm.Syntax.Declaration exposing (Declaration(..))
import Elm.Syntax.File exposing (File)
import Elm.Syntax.Node as Node exposing (Node(..))
import Elm.Syntax.Range as Syntax exposing (Range)
import Elm.Syntax.TypeAlias exposing (TypeAlias)


fixer : Fixer
fixer =
    Fixer (.key <| .info <| UnusedTypeAliasCheck.checker) fix "Remove type alias and format"


fix : ( String, File ) -> MessageData -> Patch
fix input messageData =
    case Data.getRange "range" messageData of
        Just range ->
            findAndRemoveTypeAlias input range
                |> Maybe.map Patched
                |> Maybe.withDefault (Error "Could not find type alias")

        Nothing ->
            IncompatibleData


findAndRemoveTypeAlias : ( String, File ) -> Range -> Maybe String
findAndRemoveTypeAlias ( content, file ) range =
    findTypeAlias range file
        |> Maybe.map (\typeAlias -> removeTypeAlias typeAlias content)


findTypeAlias : Range -> File -> Maybe (Node TypeAlias)
findTypeAlias range file =
    file.declarations
        |> List.filterMap
            (\(Node r decl) ->
                case decl of
                    AliasDeclaration typeAlias ->
                        if r == range then
                            Just (Node r typeAlias)

                        else
                            Nothing

                    _ ->
                        Nothing
            )
        |> List.head


removeTypeAlias : Node TypeAlias -> String -> String
removeTypeAlias (Node range typeAlias) content =
    let
        start =
            typeAlias.documentation
                |> Maybe.map (Node.range >> .start)
                |> Maybe.withDefault range.start

        end =
            range.end
    in
    FileContent.replaceRangeWith (Syntax.Range start end) "" content
