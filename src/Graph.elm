module Graph exposing (Graph, decode, encode, init, run)

import Graph.Edge as Edge exposing (Edge)
import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Files.Types exposing (Dependency, LoadedSourceFiles)
import AST.Types as AST
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
import Json.Encode as JE exposing (Value)


type alias Graph =
    { edges : List Edge
    }


init : List Edge -> Graph
init =
    Graph


run : LoadedSourceFiles -> List Dependency -> Graph
run sources deps =
    let
        files =
            sources
                |> List.filterMap (FileContext.create sources deps)
    in
        files
            |> List.map runForFile
            |> List.concat
            |> init


runForFile : FileContext -> List Edge
runForFile file =
    let
        imports =
            file.ast.imports
                |> List.map .moduleName
                |> List.map (Just >> stringFromModuleName)

        from =
            stringFromModuleName file.moduleName
    in
        List.map (\to -> Edge from to) imports


stringFromModuleName : Maybe AST.ModuleName -> String
stringFromModuleName moduleName =
    Maybe.map (String.join ".") moduleName
        |> Maybe.withDefault "Unknown"


decode : Decoder Graph
decode =
    JD.succeed Graph
        |: JD.field "edges" (JD.list Edge.decode)


encode : Graph -> Value
encode record =
    JE.object
        [ ( "edges", JE.list (List.map Edge.encode record.edges) )
        ]
