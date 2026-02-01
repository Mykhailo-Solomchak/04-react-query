import { useEffect, useState } from "react"
import SearchBar from "../SearchBar/SearchBar"
import css from "./App.module.css"
import type { Movie } from "../../types/movie"
import { fetchMovies } from "../../services/movieService"
import toast, { Toaster } from "react-hot-toast"
import Loader from "../Loader/Loader"
import ErrorMessage from "../ErrorMessage/ErrorMessage"
import MovieGrid from "../MovieGrid/MovieGrid"
import MovieModal from "../MovieModal/MovieModal"
import { keepPreviousData, useQuery } from "@tanstack/react-query"
import ReactPaginate from "react-paginate"




function App() {
    const [query, setQuery] = useState("")
    const [page, setPage] = useState(1)
    const [selectMovie, setSelectMovie] = useState<Movie|null>(null)
    const handleSelectMovie = (movie: Movie| null)=>{setSelectMovie(movie)}
    const handleSearch =  (newQuery: string) => {
        setQuery(newQuery)
        setPage(1)
    }  
    const{data, isPending, isError, isSuccess}= useQuery({
        queryKey: [`movies`, query, page],
        queryFn:()=>fetchMovies(query, page),
        enabled: query !== '',
        placeholderData: keepPreviousData
    })
    useEffect(()=>{if(isSuccess&&data.results.length ===0){
        toast.error("No movies found for your request.")
    }},[isSuccess, data])
    const totalPages = data?.total_pages ?? 0
    const movies = data?.results??[]
    return (
        <div className={css.app}>
            <SearchBar onSubmit={handleSearch} />
            {isSuccess&& totalPages >1&&(
                <ReactPaginate pageCount={totalPages}
                    pageRangeDisplayed={5}
                    marginPagesDisplayed={1}
                    onPageChange={({ selected }) => setPage(selected + 1)}
                    forcePage={page - 1}
                    containerClassName={css.pagination}
                    activeClassName={css.active}
                    nextLabel="→"
                    previousLabel="←"
/>
            )}
            {isPending&&<Loader/>}
            {isError&&<ErrorMessage/>
            
            }
            {isSuccess&&movies.length >0&&<MovieGrid movies={movies}onSelect={handleSelectMovie}/>}
       {selectMovie&&<MovieModal movie={selectMovie}onClose={()=>handleSelectMovie(null)}/>}
       <Toaster position="top-center"/>
       
       
        </div>
        
    )
}

export default App
