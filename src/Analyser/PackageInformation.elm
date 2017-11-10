port module Analyser.PackageInformation exposing (..)

import Json.Decode as JD exposing (Decoder, Value)
import Json.Decode.Extra exposing ((|:))
import RemoteData exposing (RemoteData)


port loadPackageInfo : () -> Cmd msg


port onPackageInfo : (Value -> msg) -> Sub msg


type alias PackageInformation =
    { name : String, summary : String, versions : List PackageVersion }


type Registry
    = Registry (RemoteData String (List PackageInformation))


type PackageVersion
    = PackageVersion Int Int Int


type Msg
    = OnPackageInfo (Result String (List PackageInformation))


init : ( Registry, Cmd msg )
init =
    ( Registry RemoteData.Loading
    , loadPackageInfo ()
    )


subscriptions : Sub Msg
subscriptions =
    onPackageInfo (JD.decodeValue (JD.list decodePackageInfo) >> OnPackageInfo)


decodePackageInfo : Decoder PackageInformation
decodePackageInfo =
    JD.succeed PackageInformation
        |: JD.field "name" JD.string
        |: JD.field "summary" JD.string
        |: JD.field "versions" (JD.list decodeVersion)


decodeVersion : JD.Decoder PackageVersion
decodeVersion =
    JD.string
        |> JD.andThen
            (\value ->
                case String.split "." value of
                    [ x, y, z ] ->
                        Result.map3 PackageVersion (String.toInt x) (String.toInt y) (String.toInt z)
                            |> Json.Decode.Extra.fromResult

                    _ ->
                        JD.fail "Version does not consist of three numbers"
            )


update : Msg -> Registry -> Registry
update msg (Registry model) =
    case msg of
        OnPackageInfo infos ->
            Registry <| RemoteData.fromResult infos
