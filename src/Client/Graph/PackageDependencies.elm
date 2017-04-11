module Client.Graph.PackageDependencies exposing (Model, Msg, init, update, view)

import Analyser.State exposing (State)
import Dict exposing (Dict)
import Graph.Edge exposing (Edge)
import Html exposing (Html)
import Html.Attributes as Html
import List.Extra as List
import Set


type Model
    = Model (List String) (Dict ( String, String ) Int)


type alias Msg =
    ()


init : State -> ( Model, Cmd Msg )
init { graph } =
    let
        relations =
            packageListRelationAsBag (List.map edgeToPackageRel graph.edges)

        names =
            Dict.keys relations
                |> List.concatMap (\( a, b ) -> [ a, b ])
                |> Set.fromList
                |> Set.toList
                |> List.sort
    in
        ( Model names relations
        , Cmd.none
        )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        () ->
            ( model
            , Cmd.none
            )


view : Model -> Html msg
view (Model names relations) =
    Html.table [ Html.class "table table-condensed" ]
        [ Html.tbody []
            (Html.tr [] (Html.td [] [] :: List.map headerNameTd names)
                :: List.map (\x -> packageCycleRow x names relations) names
            )
        ]


headerNameTd : String -> Html msg
headerNameTd x =
    let
        height =
            200
    in
        Html.th
            [ Html.style
                [ ( "height", toString height ++ "px" )
                , ( "text-align", "left" )
                , ( "whitespace", "nowrap" )
                , ( "width", "30px" )
                ]
            ]
            [ Html.div
                [ Html.style
                    [ ( "transform", "rotate(-90deg) translate(" ++ toString (negate height + 40) ++ "px, 0px)" )
                    , ( "width", "30px" )
                    ]
                ]
                [ Html.text x ]
            ]


asNameTd : String -> Html msg
asNameTd x =
    Html.th [] [ Html.text x ]


packageCycleRow : String -> List String -> Dict ( String, String ) Int -> Html msg
packageCycleRow name names relations =
    Html.tr []
        (asNameTd name
            :: List.map (\other -> packageContentTd name other relations) names
        )


packageContentTd : String -> String -> Dict ( String, String ) Int -> Html msg
packageContentTd from to relations =
    if from == to then
        Html.td [ Html.style [ ( "background", "black" ) ] ] []
    else
        let
            bg =
                if Dict.member ( from, to ) relations && Dict.member ( to, from ) relations then
                    "red"
                else
                    "white"
        in
            Html.td [ Html.style [ ( "background", bg ), ( "text-align", "center" ) ] ]
                [ Dict.get ( from, to ) relations
                    |> Maybe.map toString
                    |> Maybe.withDefault ""
                    |> Html.text
                ]


edgeToPackageRel : Edge -> ( String, String )
edgeToPackageRel edge =
    ( String.split "-" edge.from |> List.init |> Maybe.withDefault [] |> String.join "."
    , String.split "-" edge.to |> List.init |> Maybe.withDefault [] |> String.join "."
    )


packageListRelationAsBag : List ( String, String ) -> Dict ( String, String ) Int
packageListRelationAsBag =
    List.foldl
        (\pair base ->
            Dict.update
                pair
                (Maybe.map ((+) 1) >> Maybe.withDefault 1 >> Just)
                base
        )
        Dict.empty
