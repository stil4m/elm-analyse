port module Registry exposing (Registry, init, lookup, subscriptions, update)

import Json.Decode as JD exposing (Decoder, Value)
import Registry.Package as Package exposing (Package)
import RemoteData exposing (RemoteData)


port loadPackageInfo : () -> Cmd msg


port onPackageInfo : (Value -> msg) -> Sub msg


type Registry
    = Registry (RemoteData String (List Package))


type Lookup
    = Missing
    | Hit Package


type Msg
    = OnPackageInfo (Result String (List Package))


init : ( Registry, Cmd msg )
init =
    ( Registry RemoteData.Loading
    , loadPackageInfo ()
    )


lookup : String -> Registry -> Maybe Package
lookup key (Registry values) =
    values
        |> RemoteData.toMaybe
        |> Maybe.andThen (List.filter (.name >> (==) key) >> List.head)


subscriptions : Sub Msg
subscriptions =
    onPackageInfo (JD.decodeValue (JD.list Package.decode) >> OnPackageInfo)


update : Msg -> Registry -> Registry
update msg (Registry model) =
    case msg of
        OnPackageInfo infos ->
            Registry <| RemoteData.fromResult infos
