import classNames from "classnames";

export default function HorizontalWrap({ children, className }: React.PropsWithChildren<{ className?: string }>) {
	return <div className={classNames("mx-auto w-full px-4 lg:px-0 lg:w-3/4 xl:w-3/4", className)} style={{ maxWidth: "1500px" }}>
            
        {children}
		
    </div>
}