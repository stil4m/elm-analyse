module Analyser.Checks.MultiLineRecordFormatting exposing (checker)

import Analyser.FileContext exposing (FileContext)
import AST.Types exposing (..)
import AST.Ranges exposing (Range)
import Analyser.Configuration exposing (Configuration)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Messages.Types exposing (Message, MessageData(MultiLineRecordFormatting), newMessage)
import Inspector exposing (..)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "MultiLineRecordFormatting" ]
    }


scan : FileContext -> Configuration -> List Message
scan fileContext _ =
    let
        threshold =
            2
    in
        Inspector.inspect
            { defaultConfig | onTypeAlias = Post onTypeAlias }
            fileContext.ast
            []
            |> List.filter (Tuple.second >> List.length >> (<=) threshold)
            |> List.filterMap (\( range, fields ) -> firstTwo fields |> Maybe.map ((,) range))
            |> List.filter (Tuple.second >> fieldsOnSameLine)
            |> List.map (Tuple.first >> MultiLineRecordFormatting fileContext.path)
            |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


fieldsOnSameLine : ( RecordField, RecordField ) -> Bool
fieldsOnSameLine ( left, right ) =
    (typeReferenceRange (Tuple.second left)).start.row == (typeReferenceRange (Tuple.second right)).start.row


firstTwo : RecordDefinition -> Maybe ( RecordField, RecordField )
firstTwo def =
    case def of
        x :: y :: _ ->
            Just ( x, y )

        _ ->
            Nothing


onTypeAlias : TypeAlias -> List ( Range, RecordDefinition ) -> List ( Range, RecordDefinition )
onTypeAlias x context =
    findRecords x.typeReference ++ context


typeReferenceRange : TypeReference -> Range
typeReferenceRange x =
    case x of
        GenericType _ r ->
            r

        Typed _ _ _ r ->
            r

        Unit r ->
            r

        Tupled _ r ->
            r

        Record _ r ->
            r

        GenericRecord _ _ r ->
            r

        FunctionTypeReference _ _ r ->
            r


findRecords : TypeReference -> List ( Range, RecordDefinition )
findRecords x =
    case x of
        GenericType _ _ ->
            []

        Typed _ _ args _ ->
            List.concatMap findRecords args

        Unit _ ->
            []

        Tupled inner _ ->
            List.concatMap findRecords inner

        Record fields r ->
            ( r, fields ) :: List.concatMap (Tuple.second >> findRecords) fields

        GenericRecord _ fields r ->
            ( r, fields ) :: List.concatMap (Tuple.second >> findRecords) fields

        FunctionTypeReference left right _ ->
            -- TODO: Think about if this makes sense
            findRecords left ++ findRecords right
