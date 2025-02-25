interface Props{
    type?:'full' | 'inside'
  }
  const Loader = ({type = 'full'} : Props) => {
    return (
      <div className={`${type === 'full' ? 'h-screen' : 'absolute top-5 bottom-5 left-5 right-5'} flex items-center justify-center bg-transparent backdrop-blur-md`}>
        <div className="h-16 w-16 animate-spin rounded-full border-4 border-solid border-primary border-t-transparent"></div>
      </div>
    );
  };
  
  export default Loader;
  