interface Props{
    type?:'full' | 'inside'
  }
  const Loader = ({type = 'full'} : Props) => {
    return (
      <div className={`${type === 'full' ? 'h-screen' : 'absolute top-0 bottom-0 left-0 right-0'} flex items-center justify-center bg-transparent backdrop-blur-md`}>
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  };
  
  export default Loader;
  