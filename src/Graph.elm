module Graph exposing (Graph, decode, empty, encode, init, run)

import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Files.Types exposing (Dependency, LoadedSourceFiles)
import AST.Types as AST
import Graph.Edge as Edge exposing (Edge)
import Graph.Node as Node exposing (Node)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Json.Encode as JE exposing (Value)


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

        edges =
            List.map edgesInFile files
                |> List.concat

        nodes =
            List.filterMap .moduleName files
                |> List.map nodeFromFile
    in
        init edges nodes


nodeFromFile : AST.ModuleName -> Node
nodeFromFile moduleName =
    { identifier = nodeIdentifierFromModuleName moduleName
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
    String.join "." moduleName


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
