function Plants(){

    return (
        <section>
            <div className="bg-black w-96 h-96">a</div>
            <div className="bg-black ">a</div>
            <div className="bg-black ">a</div>
            <div className="bg-black ">a</div>
            <div className="bg-black ">a</div>
            <div className="bg-black w-3xs h-[150]">a</div>
        </section>
    )
}

export default function PlantsPage() {

    return (
        <div className="flex flex-col gap-12 items-start justify-start pt-10 pl-16">
            <h2 className="text-5xl font-bold">Les différentes plantes !</h2>
            <Plants />
        </div>
    )

    
}

