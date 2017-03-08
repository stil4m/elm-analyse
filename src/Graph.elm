module Graph exposing (Graph, decode, empty, encode, init, run)

import AST.Types as AST
import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Files.Types exposing (Dependency, LoadedSourceFiles)
import Dict exposing (Dict)
import Graph.Color as Color exposing (Color)
import Graph.Edge as Edge exposing (Edge)
import Graph.Node as Node exposing (Node)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Json.Encode as JE exposing (Value)
import List.Extra as List
import Set


type alias Graph =
    { edges : List Edge
    , nodes : List Node
    }


empty : Graph
empty =
    init [] []


init : List Edge -> List Node -> Graph
init =
    Graph


run : LoadedSourceFiles -> List Dependency -> Graph
run sources deps =
    let
        files =
            List.filterMap (FileContext.create sources deps) sources

        moduleNames =
            List.filterMap .moduleName files

        moduleColors =
            colors moduleNames

        nodes =
            List.map (nodeFromFile moduleColors) moduleNames

        identifiers =
            List.map .identifier nodes
                |> Set.fromList

        edges =
            List.map edgesInFile files
                |> List.concat
                |> -- edges to external node (not included in nodes)
                   -- must be filtered out to create a valid graph
                   Edge.filterForIdentifiers identifiers
    in
        init edges nodes


topModuleName : AST.ModuleName -> String
topModuleName moduleNameAST =
    List.head moduleNameAST
        |> Maybe.withDefault "Unknown"


colors : List AST.ModuleName -> Dict String Color
colors moduleNames =
    let
        topModuleNames =
            List.map topModuleName moduleNames
                |> Set.fromList
                |> Set.toList
                |> List.sort

        allColors =
            Color.list

        colorsLength =
            List.length allColors

        colorsForModuleNames =
            topModuleNames
                |> List.indexedMap
                    (\index name ->
                        let
                            color =
                                List.getAt (index % colorsLength) allColors
                                    |> Maybe.withDefault Color.fallback
                        in
                            ( name, color )
                    )
    in
        Dict.fromList colorsForModuleNames


nodeFromFile : Dict String Color -> AST.ModuleName -> Node
nodeFromFile colors moduleName =
    { color = Dict.get (topModuleName moduleName) colors |> Maybe.withDefault Color.fallback
    , identifier = nodeIdentifierFromModuleName moduleName
    , name = moduleName
    }


edgesInFile : FileContext -> List Edge
edgesInFile file =
    case file.moduleName of
        Just fromModule ->
            let
                from =
                    nodeIdentifierFromModuleName fromModule

                imports =
                    file.ast.imports
                        |> List.map .moduleName
                        |> List.map nodeIdentifierFromModuleName
            in
                List.map (\to -> Edge from to) imports

        Nothing ->
            []


nodeIdentifierFromModuleName : AST.ModuleName -> Node.Identifier
nodeIdentifierFromModuleName moduleName =
    String.join "-" moduleName


decode : Decoder Graph
decode =
    JD.succeed Graph
        |: JD.field "edges" (JD.list Edge.decode)
        |: JD.field "nodes" (JD.list Node.decode)


encode : Graph -> Value
encode record =
    JE.object
        [ ( "edges", JE.list (List.map Edge.encode record.edges) )
        , ( "nodes", JE.list (List.map Node.encode record.nodes) )
        ]
