module Analyser.Modules exposing (Modules, build, decode, empty, encode)

import Analyser.CodeBase exposing (CodeBase)
import Analyser.FileContext as FileContext exposing (FileContext)
import Analyser.Files.Types exposing (LoadedSourceFiles)
import Elm.Syntax.Base exposing (ModuleName)
import Json.Decode as JD exposing (Decoder)
import Json.Decode.Extra exposing ((|:))
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


build : CodeBase -> LoadedSourceFiles -> Modules
build codeBase sources =
    let
        files =
            FileContext.build codeBase sources
    in
    { projectModules = List.filterMap .moduleName files
    , dependencies = List.concatMap edgesInFile files
    }


edgesInFile : FileContext -> List ( List String, List String )
edgesInFile file =
    case file.moduleName of
        Just moduleName ->
            file.ast.imports
                |> List.map .moduleName
                |> List.map ((,) moduleName)

        Nothing ->
            []


decode : JD.Decoder Modules
decode =
    JD.succeed Modules
        |: JD.field "projectModules" (JD.list decodeModuleName)
        |: JD.field "dependencies" (JD.list decodeDependency)


tupleFromLIst : List a -> JD.Decoder ( a, a )
tupleFromLIst x =
    case x of
        [ a, b ] ->
            JD.succeed ( a, b )

        _ ->
            JD.fail "Not a tuple"


encode : Modules -> Value
encode e =
    JE.object
        [ ( "projectModules", JE.list <| List.map encodeModuleName e.projectModules )
        , ( "dependencies", JE.list (List.map encodeDependency e.dependencies) )
        ]


encodeDependency : ( ModuleName, ModuleName ) -> JE.Value
encodeDependency ( x, y ) =
    JE.list [ encodeModuleName x, encodeModuleName x ]


decodeDependency : Decoder ( ModuleName, ModuleName )
decodeDependency =
    JD.list decodeModuleName |> JD.andThen tupleFromLIst


decodeModuleName : Decoder ModuleName
decodeModuleName =
    JD.string |> JD.map (String.split ".")


encodeModuleName : ModuleName -> Value
encodeModuleName =
    String.join "." >> JE.string
