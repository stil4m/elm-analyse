module Analyser.Messages.Data exposing (MessageData, addErrorMessage, addFileName, addModuleName, addRange, addRanges, addVarName, conformToSchema, decode, description, encode, firstRange, getRange, getRangeList, getRanges, init, withDescription)

import Analyser.Messages.Schema as Schema exposing (Schema)
import Dict exposing (Dict)
import Dict.Extra
import Elm.Syntax.ModuleName exposing (ModuleName)
import Elm.Syntax.Range as Range exposing (Range)
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE


type MessageData
    = MessageData Description (Dict String DataValue)


type DataValue
    = RangeV Range
    | FileNameV String
    | VariableNameV String
    | RangeListV (List Range)
    | ModuleNameV ModuleName
    | ErrorMessageV String


type alias Description =
    String


conformToSchema : Schema -> MessageData -> Bool
conformToSchema schema (MessageData _ d) =
    asSchema d == schema


asSchema : Dict String DataValue -> Schema
asSchema d =
    let
        applyV : String -> DataValue -> Schema -> Schema
        applyV k v s =
            (case v of
                RangeV _ ->
                    Schema.rangeProp

                FileNameV _ ->
                    Schema.fileProp

                VariableNameV _ ->
                    Schema.varProp

                RangeListV _ ->
                    Schema.rangeListProp

                ModuleNameV _ ->
                    Schema.moduleProp

                ErrorMessageV _ ->
                    Schema.errorProp
            )
                k
                s
    in
    Dict.foldl applyV Schema.schema d


withDescription : String -> MessageData -> MessageData
withDescription desc (MessageData _ d) =
    MessageData desc d


description : MessageData -> String
description (MessageData d _) =
    d


firstRange : MessageData -> Maybe Range
firstRange x =
    getRanges x |> List.head


getRanges : MessageData -> List Range
getRanges (MessageData _ x) =
    Dict.values x |> List.concatMap dataValueRanges


dataValueRanges : DataValue -> List Range
dataValueRanges dv =
    case dv of
        RangeV r ->
            [ r ]

        RangeListV rs ->
            rs

        _ ->
            []


decode : Schema -> Decoder MessageData
decode schema =
    JD.map2 MessageData
        (JD.field "description" JD.string)
        (JD.field "properties" (decodeDataValues schema))


decodeDataValues : Schema -> Decoder (Dict String DataValue)
decodeDataValues schema =
    JD.dict JD.value
        |> JD.andThen
            (\d ->
                d
                    |> Dict.Extra.filterMap (decodeDataValue schema)
                    |> JD.succeed
            )


decodeDataValue : Schema -> String -> JE.Value -> Maybe DataValue
decodeDataValue schema k value =
    JD.decodeValue (schemaDecoder k schema) value |> Result.toMaybe


schemaDecoder : String -> Schema -> Decoder DataValue
schemaDecoder key schema =
    case Schema.propertyTypeForKey key schema of
        Nothing ->
            JD.fail ("Unknown property key: " ++ key)

        Just propertyType ->
            case propertyType of
                Schema.Range ->
                    JD.map RangeV Range.decoder

                Schema.FileName ->
                    JD.map FileNameV JD.string

                Schema.VariableName ->
                    JD.map VariableNameV JD.string

                Schema.RangeList ->
                    JD.map RangeListV (JD.list Range.decoder)

                Schema.ModuleName ->
                    JD.map ModuleNameV (JD.list JD.string)

                Schema.ErrorMessage ->
                    JD.map ErrorMessageV JD.string


encode : MessageData -> JE.Value
encode (MessageData desc m) =
    JE.object
        [ ( "description", JE.string desc )
        , ( "properties"
          , m
                |> Dict.toList
                |> List.map (Tuple.mapSecond encodeDataValue)
                |> JE.object
          )
        ]


encodeDataValue : DataValue -> JE.Value
encodeDataValue dataValue =
    case dataValue of
        RangeV v ->
            Range.encode v

        FileNameV v ->
            JE.string v

        VariableNameV v ->
            JE.string v

        RangeListV v ->
            JE.list Range.encode v

        ModuleNameV v ->
            JE.list JE.string v

        ErrorMessageV v ->
            JE.string v


init : Description -> MessageData
init desc =
    MessageData desc Dict.empty


addRange : String -> Range -> MessageData -> MessageData
addRange k v (MessageData desc d) =
    MessageData desc (Dict.insert k (RangeV v) d)


addRanges : String -> List Range -> MessageData -> MessageData
addRanges k v (MessageData desc d) =
    MessageData desc (Dict.insert k (RangeListV v) d)


addModuleName : String -> ModuleName -> MessageData -> MessageData
addModuleName k v (MessageData desc d) =
    MessageData desc (Dict.insert k (ModuleNameV v) d)


addFileName : String -> String -> MessageData -> MessageData
addFileName k v (MessageData desc d) =
    MessageData desc (Dict.insert k (FileNameV v) d)


addVarName : String -> String -> MessageData -> MessageData
addVarName k v (MessageData desc d) =
    MessageData desc (Dict.insert k (VariableNameV v) d)


addErrorMessage : String -> String -> MessageData -> MessageData
addErrorMessage k v (MessageData desc d) =
    MessageData desc (Dict.insert k (ErrorMessageV v) d)


getRange : String -> MessageData -> Maybe Range
getRange k (MessageData _ d) =
    Dict.get k d |> Maybe.andThen valueAsRange


getRangeList : String -> MessageData -> Maybe (List Range)
getRangeList k (MessageData _ d) =
    Dict.get k d |> Maybe.andThen valueAsRangeList


valueAsRange : DataValue -> Maybe Range
valueAsRange dv =
    case dv of
        RangeV v ->
            Just v

        _ ->
            Nothing


valueAsRangeList : DataValue -> Maybe (List Range)
valueAsRangeList dv =
    case dv of
        RangeListV v ->
            Just v

        _ ->
            Nothing
