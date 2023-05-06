use hyper::server::conn::http1;
use hyper::{service::service_fn, Request, Response};
use hyper_staticfile::{Body, Resolver, ResponseBuilder};
use std::{convert::Infallible, error::Error, net::SocketAddr};
use tokio::net::TcpListener;

async fn serve_static(
    request: Request<hyper::body::Incoming>,
) -> Result<Response<Body>, Infallible> {
    let resolver = Resolver::new("../client/dist/");
    let result = resolver.resolve_request(&request).await.unwrap();
    let response = ResponseBuilder::new()
        .request(&request)
        .build(result)
        .unwrap();
    Ok(response)
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn Error + Send + Sync>> {
    let addr = SocketAddr::from(([127, 0, 0, 1], 3000));

    let listener = TcpListener::bind(addr).await?;

    loop {
        let (stream, _) = listener.accept().await?;

        tokio::task::spawn(async move {
            if let Err(err) = http1::Builder::new()
                .serve_connection(stream, service_fn(serve_static))
                .await
            {
                println!("Error serving connection: {:?}", err);
            }
        });
    }
}
