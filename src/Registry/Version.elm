module Registry.Version exposing (Version, decode, fromString, isMajorUpgrade, order)

import Json.Decode as JD exposing (Decoder, Value)
import Json.Decode.Extra exposing ((|:))


type Version
    = Version Int Int Int


isMajorUpgrade : Version -> Version -> Bool
isMajorUpgrade (Version a _ _) (Version b _ _) =
    a < b


order : Version -> Version -> Order
order (Version a b c) (Version x y z) =
    if a /= x then
        compare a x
    else if b /= y then
        compare b y
    else
        compare c z


fromString : String -> Result String Version
fromString input =
    case String.split "." input of
        [ x, y, z ] ->
            fromStrings ( x, y, z )

        _ ->
            Err "Version does not consist of three numbers"


fromStrings : ( String, String, String ) -> Result String Version
fromStrings ( x, y, z ) =
    Result.map3 Version (String.toInt x) (String.toInt y) (String.toInt z)


decode : Decoder Version
decode =
    JD.string |> JD.andThen (fromString >> Json.Decode.Extra.fromResult)
