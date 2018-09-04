module Result.Extra exposing (isOk, merge)


merge : Result a a -> a
merge r =
    case r of
        Ok rr ->
            rr

        Err rr ->
            rr


isOk : Result a b -> Bool
isOk r =
    case r of
        Ok b ->
            True

        Err a ->
            False
