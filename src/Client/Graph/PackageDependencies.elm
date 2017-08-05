module Client.Graph.PackageDependencies exposing (Model, Msg, init, update, view)

import Analyser.State exposing (State)
import Dict exposing (Dict)
import Graph exposing (Graph)
import Graph.Edge exposing (Edge)
import Graph.Node exposing (Node)
import Html exposing (Html)
import Html.Attributes as Html
import Html.Events as Html
import List.Extra as List
import Set


type alias Model =
    { names : List String
    , relations : PackageFileRelations
    , selected : Maybe ( String, String )
    , graph : Graph Node
    }


type alias PackageFileRelations =
    Dict ( String, String ) (List ( String, String ))


type Msg
    = Select String String


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
    ( Model names relations Nothing graph
    , Cmd.none
    )


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        Select from to ->
            ( { model | selected = Just ( from, to ) }
            , Cmd.none
            )


view : Model -> Html Msg
view { names, relations, selected } =
    Html.div []
        [ Html.table [ Html.class "table table-condensed" ]
            [ Html.tbody []
                (Html.tr [] (Html.td [] [] :: List.map headerNameTd names)
                    :: List.map (\x -> packageCycleRow x names relations selected) names
                )
            ]
        , Maybe.map (interPackageRelationsTable relations) selected |> Maybe.withDefault (Html.div [] [])
        ]


interPackageRelationsTable : PackageFileRelations -> ( String, String ) -> Html a
interPackageRelationsTable relations ( from, to ) =
    Html.div [ Html.class "row" ]
        [ Html.div [ Html.class "col-md-6" ]
            [ interPackageRelationTable ( from, to ) (Dict.get ( from, to ) relations |> Maybe.withDefault [])
            ]
        , Html.div [ Html.class "col-md-6" ]
            [ interPackageRelationTable ( to, from ) (Dict.get ( to, from ) relations |> Maybe.withDefault [])
            ]
        ]


interPackageRelationTable : ( String, String ) -> List ( String, String ) -> Html a
interPackageRelationTable ( from, to ) rels =
    Html.table [ Html.class "table" ]
        [ Html.thead []
            [ Html.tr []
                [ Html.th []
                    [ packageNameHtml from, Html.text " -> ", packageNameHtml to ]
                ]
            ]
        , Html.tbody [] <|
            case rels of
                [] ->
                    [ Html.tr []
                        [ Html.td []
                            [ Html.i
                                [ Html.style [ ( "color", "#777" ) ] ]
                                [ Html.text "No dependencies" ]
                            ]
                        ]
                    ]

                _ ->
                    rels
                        |> List.map (\( a, b ) -> a ++ " -> " ++ b)
                        |> List.map (\x -> Html.tr [] [ Html.td [] [ Html.text x ] ])
        ]


packageNameHtml : String -> Html msg
packageNameHtml input =
    case input of
        "" ->
            Html.span [ Html.style [ ( "color", "#999" ) ] ]
                [ Html.text "<<root>>" ]

        _ ->
            Html.text input


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
            [ packageNameHtml x ]
        ]


asNameTd : String -> Html msg
asNameTd x =
    Html.th [] [ packageNameHtml x ]


packageCycleRow : String -> List String -> PackageFileRelations -> Maybe ( String, String ) -> Html Msg
packageCycleRow name names relations selected =
    Html.tr []
        (asNameTd name
            :: List.map (\other -> packageContentTd name other relations selected) names
        )


packageContentTd : String -> String -> PackageFileRelations -> Maybe ( String, String ) -> Html Msg
packageContentTd from to relations selected =
    if from == to then
        Html.td [ Html.style [ ( "background", "black" ) ] ] []
    else
        let
            styleClass =
                if selected == Just ( from, to ) || selected == Just ( to, from ) then
                    "info"
                else if Dict.member ( from, to ) relations && Dict.member ( to, from ) relations then
                    "danger"
                else
                    ""
        in
        Html.td
            [ Html.class styleClass
            , Html.style [ ( "text-align", "center" ) ]
            , Html.onClick (Select from to)
            ]
            [ Dict.get ( from, to ) relations
                |> Maybe.map (List.length >> toString)
                |> Maybe.withDefault ""
                |> Html.text
            ]


edgeToPackageRel : Edge -> ( ( String, String ), ( String, String ) )
edgeToPackageRel edge =
    let
        fromList =
            String.split "-" edge.from

        toList =
            String.split "-" edge.to

        fromPackage =
            fromList |> List.init |> Maybe.withDefault [] |> String.join "."

        toPackage =
            toList |> List.init |> Maybe.withDefault [] |> String.join "."
    in
    ( ( fromPackage, toPackage )
    , ( fromList |> String.join ".", toList |> String.join "." )
    )


packageListRelationAsBag : List ( ( String, String ), ( String, String ) ) -> PackageFileRelations
packageListRelationAsBag =
    List.foldr
        (\( key, value ) base ->
            Dict.update
                key
                (Maybe.map ((::) value) >> Maybe.withDefault [ value ] >> Just)
                base
        )
        Dict.empty
