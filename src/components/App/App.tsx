import { useState } from "react"
import SearchBar from "../SearchBar/SearchBar"
import css from "./App.module.css"
import type { Movie } from "../../types/movie"
import { fetchMovies } from "../../services/movieService"
import toast, { Toaster } from "react-hot-toast"
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import MovieGrid from "../MovieGrid/MovieGrid"
import MovieModal from "../MovieModal/MovieModal"

function App() {
    const [movies, setMovies] = useState<Movie[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const [isError, setIsError] = useState<boolean>(false)
    const [selectMovie, setSelectMovie] = useState<Movie|null>(null)
    const handleSelectMovie = (movie: Movie| null)=>{setSelectMovie(movie)}
    const handleSearch = async (query: string) => {
        try {
            setIsError(false)
            setIsLoading(true)
            setMovies([])
            const fetchedMovies = await fetchMovies(query)
            if (fetchedMovies.length === 0) {
                toast.error("No movies found for your request.")
                return
            }
            setMovies(fetchedMovies)
        } catch {
            setIsError(true)
        }
        finally {
            setIsLoading(false)
        }
    }  
    
    return (
        <div className={css.app}>
            <SearchBar onSubmit={handleSearch} />
            {isLoading&&<Loader/>}
            {isError&&<ErrorMessage/>
            
            }
            {movies.length >0&&<MovieGrid movies={movies}onSelect={handleSelectMovie}/>}
       {selectMovie&&<MovieModal movie={selectMovie}onClose={()=>handleSelectMovie(null)}/>}
       <Toaster position="top-center"/>
       
       
        </div>
        
    )
}

export default App