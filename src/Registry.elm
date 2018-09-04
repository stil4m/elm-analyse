module Registry exposing (Registry, fromValue, lookup)

import Json.Decode as JD exposing (Value)
import Registry.Package as Package exposing (Package)


type Registry
    = Registry (Result JD.Error (List Package))


lookup : String -> Registry -> Maybe Package
lookup key (Registry values) =
    values
        |> Result.toMaybe
        |> Maybe.andThen (List.filter (.name >> (==) key) >> List.head)


fromValue : Value -> Registry
fromValue value =
    Registry (JD.decodeValue (JD.list Package.decode) value)
