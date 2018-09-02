module Maybe.Extra exposing (filter)


filter : (a -> Bool) -> Maybe a -> Maybe a
filter f =
    Maybe.andThen
        (\a ->
            if f a then
                Just a

            else
                Nothing
        )
