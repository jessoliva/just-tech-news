async function upvoteClickHandler(event) {
    event.preventDefault();
  
    const id = window.location.toString().split('/')[
        window.location.toString().split('/').length - 1
    ];
    
    // console.log(id);

    const response = await fetch('/api/posts/upvote', {
        method: 'PUT',
        body: JSON.stringify({
            post_id: id
        }),
        headers: {
          'Content-Type': 'application/json'
        }
    });
      
    if (response.ok) {
        document.location.reload();
    } 
    else {
        alert(response.statusText);
    }
};
// the click handler as an async function, because it will eventually be making an asynchronous PUT request with fetch()
// we need to provide two things to the PUT request for an upvote to go through: the post_id and the user_id

document.querySelector('.upvote-btn').addEventListener('click', upvoteClickHandler);
