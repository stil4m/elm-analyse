module Analyser.Modules exposing (Modules, build, decode, empty, encode)

import Analyser.Checks.UnusedDependency as UnusedDependency
import Analyser.CodeBase exposing (CodeBase)
import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Files.Types exposing (LoadedSourceFiles)
import Elm.Dependency exposing (Dependency)
import Elm.Syntax.ModuleName as ModuleName exposing (ModuleName)
import Elm.Syntax.Node as Node
import Json.Decode as JD exposing (Decoder)
import Json.Encode as JE exposing (Value)


type alias Modules =
    { projectModules : List ModuleName
    , dependencies : List ( ModuleName, ModuleName )
    }


empty : Modules
empty =
    { projectModules = []
    , dependencies = []
    }


build : CodeBase -> LoadedSourceFiles -> ( List Dependency, Modules )
build codeBase sources =
    let
        files =
            FileContext.build codeBase sources
    in
    ( UnusedDependency.check codeBase files
    , { projectModules = List.map .moduleName files
      , dependencies = List.concatMap edgesInFile files
      }
    )


edgesInFile : FileContext -> List ( List String, List String )
edgesInFile file =
    file.ast.imports
        |> List.map Node.value
        |> List.map .moduleName
        |> List.map Node.value
        |> List.map (\b -> ( file.moduleName, b ))


decode : JD.Decoder Modules
decode =
    JD.map2 Modules
        (JD.field "projectModules" (JD.list ModuleName.decoder))
        (JD.field "dependencies" (JD.list decodeDependency))


tupleFromList : List a -> JD.Decoder ( a, a )
tupleFromList x =
    case x of
        [ a, b ] ->
            JD.succeed ( a, b )

        _ ->
            JD.fail "Not a tuple"


encode : Modules -> Value
encode e =
    JE.object
        [ ( "projectModules", JE.list ModuleName.encode e.projectModules )
        , ( "dependencies", JE.list encodeDependency e.dependencies )
        ]


encodeDependency : ( ModuleName, ModuleName ) -> JE.Value
encodeDependency ( x, y ) =
    JE.list ModuleName.encode [ x, y ]


decodeDependency : Decoder ( ModuleName, ModuleName )
decodeDependency =
    JD.list ModuleName.decoder |> JD.andThen tupleFromList
