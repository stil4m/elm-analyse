module Analyser.Messages.Schema exposing (PropertyType(..), Schema, errorProp, fileProp, moduleProp, propertyTypeForKey, rangeListProp, rangeProp, schema, varProp, viewSchema)

import Dict exposing (Dict)
import Html


type PropertyType
    = Range
    | FileName
    | VariableName
    | RangeList
    | ModuleName
    | ErrorMessage


type Schema
    = Schema (Dict String PropertyType)


schema : Schema
schema =
    Schema Dict.empty


propertyTypeForKey : String -> Schema -> Maybe PropertyType
propertyTypeForKey k (Schema s) =
    Dict.get k s


viewSchema : Schema -> Html.Html msg
viewSchema (Schema d) =
    Html.ul []
        (List.map viewArgument <| Dict.toList d)


viewArgument : ( String, PropertyType ) -> Html.Html msg
viewArgument ( name, t ) =
    Html.li []
        [ Html.code []
            [ Html.text name, Html.text " : ", viewPropertyType t ]
        ]


viewPropertyType : PropertyType -> Html.Html msg
viewPropertyType p =
    case p of
        Range ->
            Html.text "Range"

        FileName ->
            Html.text "File"

        VariableName ->
            Html.text "Variable"

        RangeList ->
            Html.text "[Range]"

        ModuleName ->
            Html.text "ModuleName"

        ErrorMessage ->
            Html.text "ErrorMessage"


fileProp : String -> Schema -> Schema
fileProp k (Schema s) =
    Schema (Dict.insert k FileName s)


varProp : String -> Schema -> Schema
varProp k (Schema s) =
    Schema (Dict.insert k VariableName s)


rangeProp : String -> Schema -> Schema
rangeProp k (Schema s) =
    Schema (Dict.insert k Range s)


rangeListProp : String -> Schema -> Schema
rangeListProp k (Schema s) =
    Schema (Dict.insert k RangeList s)


moduleProp : String -> Schema -> Schema
moduleProp k (Schema s) =
    Schema (Dict.insert k ModuleName s)


errorProp : String -> Schema -> Schema
errorProp k (Schema s) =
    Schema (Dict.insert k ErrorMessage s)
