module Analyser exposing (..)

import AST.Types as AST
import AnalyserPorts as Ports
import Interfaces.Interface as Interface
import Parser.Parser
import Platform exposing (program, programWithFlags)
import AST.Util as Util


type alias Flags =
    { interfaceFiles : InputInterfaces
    , sourceFiles : List String
    }


type alias InputInterfaces =
    List ( String, List String )


type Msg
    = OnFileContent ( String, String )


type alias InputFiles =
    List String


type alias Model =
    State


type alias LoadedDependencies =
    List LoadedDependency


type alias LoadedDependency =
    { dependency : String
    , interfaces : List (Result String LoadedInterface)
    }


type alias LoadedInterface =
    { moduleName : Maybe AST.ModuleName
    , interface : Interface.Interface
    }


type State
    = LoadingInterfaces InputInterfaces InputFiles LoadedDependencies
    | LoadingInterface InputInterfaces InputFiles LoadedDependencies ( String, String )
    | LoadingSourceFiles InputFiles LoadedDependencies


main : Program Flags Model Msg
main =
    programWithFlags { init = init, update = update, subscriptions = subscriptions }


init : Flags -> ( Model, Cmd Msg )
init { interfaceFiles, sourceFiles } =
    (LoadingInterfaces interfaceFiles sourceFiles [])
        |> nextAction


nextAction : Model -> ( Model, Cmd Msg )
nextAction model =
    case model of
        LoadingInterfaces inputInterfaces inputFiles loadedInterfaces ->
            handleLoadingInterfaces inputInterfaces inputFiles loadedInterfaces

        LoadingSourceFiles inputFiles loadedInterfaces ->
            handleLoadingSourceFiles inputFiles loadedInterfaces

        LoadingInterface _ _ _ _ ->
            --TODO some debug statement
            model ! []


handleLoadingInterfaces : InputInterfaces -> InputFiles -> LoadedDependencies -> ( Model, Cmd Msg )
handleLoadingInterfaces inputInterfaces inputFiles loadedInterfaces =
    case inputInterfaces of
        [] ->
            handleLoadingSourceFiles inputFiles loadedInterfaces

        ( pack, files ) :: xs ->
            case files of
                file :: restFiles ->
                    ( LoadingInterface (( pack, restFiles ) :: xs) inputFiles loadedInterfaces ( pack, file )
                    , Ports.loadFile file
                    )

                [] ->
                    handleLoadingInterfaces xs inputFiles loadedInterfaces


handleLoadingSourceFiles : InputFiles -> LoadedDependencies -> ( Model, Cmd Msg )
handleLoadingSourceFiles inputFiles loadedInterfaces =
    LoadingSourceFiles inputFiles (Debug.log "X" loadedInterfaces) ! []


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        OnFileContent ( _, content ) ->
            case model of
                LoadingInterface x y z ( dependency, fileName ) ->
                    onInputLoadingInterface x y z ( dependency, fileName, content )

                _ ->
                    model ! []


onInputLoadingInterface : InputInterfaces -> InputFiles -> LoadedDependencies -> ( String, String, String ) -> ( Model, Cmd Msg )
onInputLoadingInterface x y z ( dependency, fileName, content ) =
    let
        loadedInterfaceForFile : AST.File -> LoadedInterface
        loadedInterfaceForFile file =
            { moduleName = Util.fileModuleName file, interface = Interface.build file }

        result : Result String LoadedInterface
        result =
            Parser.Parser.parse content
                |> Result.fromMaybe "Could not parse file"
                |> Result.map loadedInterfaceForFile
    in
        (LoadingInterfaces x y (addLoadedInterface dependency result z))
            |> nextAction


addLoadedInterface : String -> Result String LoadedInterface -> LoadedDependencies -> LoadedDependencies
addLoadedInterface dependency loadedInterface input =
    let
        ( left, right ) =
            List.partition (.dependency >> (==) dependency) input

        newLeft =
            left
                |> List.head
                |> Maybe.map (\x -> { x | interfaces = loadedInterface :: x.interfaces })
                |> Maybe.map (flip (::) (List.drop 1 left))
                |> Maybe.withDefault [ { dependency = dependency, interfaces = [ loadedInterface ] } ]
    in
        newLeft ++ right


subscriptions : a -> Sub Msg
subscriptions model =
    Ports.fileContent OnFileContent
