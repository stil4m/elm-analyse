module Analyser.Checks.MultiLineRecordFormatting exposing (checker)

import ASTUtil.Inspector as Inspector exposing (..)
import Analyser.Checks.Base exposing (Checker, keyBasedChecker)
import Analyser.Configuration exposing (Configuration)
import Analyser.FileContext exposing (FileContext)
import Analyser.Messages.Range as Range exposing (Range, RangeContext)
import Analyser.Messages.Types exposing (Message, MessageData(MultiLineRecordFormatting), newMessage)
import Elm.Syntax.Range as Syntax
import Elm.Syntax.TypeAlias exposing (..)
import Elm.Syntax.TypeAnnotation exposing (..)


checker : Checker
checker =
    { check = scan
    , shouldCheck = keyBasedChecker [ "MultiLineRecordFormatting" ]
    , key = "MultiLineRecordFormatting"
    , name = "MultiLine Record Formatting"
    , description = "Records in type aliases should be formatted on multiple lines to help the reader."
    }


scan : RangeContext -> FileContext -> Configuration -> List Message
scan rangeContext fileContext _ =
    let
        threshold =
            2
    in
    Inspector.inspect
        { defaultConfig | onTypeAlias = Post (onTypeAlias rangeContext) }
        fileContext.ast
        []
        |> List.filter (Tuple.second >> List.length >> (<=) threshold)
        |> List.filterMap (\( range, fields ) -> firstTwo fields |> Maybe.map ((,) range))
        |> List.filter (Tuple.second >> fieldsOnSameLine)
        |> List.map (Tuple.first >> MultiLineRecordFormatting fileContext.path)
        |> List.map (newMessage [ ( fileContext.sha1, fileContext.path ) ])


fieldsOnSameLine : ( RecordField, RecordField ) -> Bool
fieldsOnSameLine ( left, right ) =
    (typeAnnotationRange (Tuple.second left)).start.row == (typeAnnotationRange (Tuple.second right)).start.row


firstTwo : RecordDefinition -> Maybe ( RecordField, RecordField )
firstTwo def =
    case def of
        x :: y :: _ ->
            Just ( x, y )

        _ ->
            Nothing


onTypeAlias : RangeContext -> TypeAlias -> List ( Range, RecordDefinition ) -> List ( Range, RecordDefinition )
onTypeAlias rangeContext x context =
    findRecords rangeContext x.typeAnnotation ++ context


typeAnnotationRange : TypeAnnotation -> Syntax.Range
typeAnnotationRange x =
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

        FunctionTypeAnnotation _ _ r ->
            r


findRecords : RangeContext -> TypeAnnotation -> List ( Range, RecordDefinition )
findRecords rangeContext x =
    case x of
        GenericType _ _ ->
            []

        Typed _ _ args _ ->
            List.concatMap (findRecords rangeContext) args

        Unit _ ->
            []

        Tupled inner _ ->
            List.concatMap (findRecords rangeContext) inner

        Record fields r ->
            ( Range.build rangeContext r, fields ) :: List.concatMap (Tuple.second >> findRecords rangeContext) fields

        GenericRecord _ fields r ->
            ( Range.build rangeContext r, fields ) :: List.concatMap (Tuple.second >> findRecords rangeContext) fields

        FunctionTypeAnnotation left right _ ->
            findRecords rangeContext left ++ findRecords rangeContext right
