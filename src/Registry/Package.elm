module Registry.Package exposing (Package, decode, newestVersion)

import Json.Decode as JD exposing (Decoder, Value)
import Json.Decode.Extra exposing ((|:))
import Registry.Version as Version exposing (Version)


type alias Package =
    { name : String
    , summary : String
    , versions : List Version
    }


decode : Decoder Package
decode =
    JD.succeed Package
        |: JD.field "name" JD.string
        |: JD.field "summary" JD.string
        |: JD.field "versions" (JD.list Version.decode)


newestVersion : Package -> Maybe Version
newestVersion p =
    List.sortWith Version.order p.versions |> List.head
