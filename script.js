document.addEventListener("DOMContentLoaded", () => {
  const apiKey = "tXU8H5KKqvHd9tUfzEinNfcOe6QVixdgICTi5f6J7Fs="; // Replace with your API key
  const emailID = "ameen.desk@gmail.com"; // Replace with your email

  const loadJobsButton = document.getElementById("loadJobs");
  const jobList = document.getElementById("jobList");

  loadJobsButton.addEventListener("click", () => {
    fetchJobs(apiKey, emailID);
  });

  function fetchJobs(apiKey, emailID) {
    const apiUrl = "https://data.usajobs.gov/api/Search?ResultsPerPage=500";

    const headers = new Headers({
      "Authorization-Key": apiKey,
      "User-Agent": emailID,
      Host: "data.usajobs.gov",
    });

    const request = new Request(apiUrl, { headers });

    fetch(request)
      .then((response) => response.json())
      .then((data) => {
        displayJobs(data.SearchResult.SearchResultItems);
      })
      .catch((error) => {
        console.error("Error fetching jobs:", error);
      });
  }

  function displayJobs(jobs) {
    jobList.innerHTML = ""; // Clear existing job listings

    if (jobs.length === 0) {
      jobList.innerHTML = "No jobs found.";
      return;
    }

    const jobListFragment = document.createDocumentFragment();

    jobs.forEach((job) => {
      const ApplicationCloseDate =
        job.MatchedObjectDescriptor.ApplicationCloseDate;

      const jobItem = document.createElement("div");
      jobItem.className = "job-item";

      // Create a button for showing job details
      const showDetailsButton = document.createElement("button");
      showDetailsButton.className = "show-details";
      showDetailsButton.innerText = "Show Details";

      // Create a div for job details
      const jobDetailsDiv = document.createElement("div");
      jobDetailsDiv.className = "job-details";
      jobDetailsDiv.style.display = "none"; // Initially hide job details

      // Populate job details
      jobDetailsDiv.innerHTML = `
    <p>${job.MatchedObjectDescriptor.UserArea.Details.JobSummary}</p>
    
`;

      // Add a click event listener to the button to toggle job details visibility
      showDetailsButton.addEventListener("click", () => {
        if (jobDetailsDiv.style.display === "none") {
          jobDetailsDiv.style.display = "block";
        } else {
          jobDetailsDiv.style.display = "none";
        }
      });

      const applyLink = document.createElement("a");
      applyLink.href = job.MatchedObjectDescriptor.ApplyURI[0];
      applyLink.target = "_blank";

      applyLink.innerHTML = `
                <h2>${job.MatchedObjectDescriptor.PositionTitle}</h2>
                <p>${job.MatchedObjectDescriptor.OrganizationName}</p>
                <p>${job.MatchedObjectDescriptor.PositionLocationDisplay}</p>
                <p>Last Date: ${ApplicationCloseDate.substring(0, 10)}</p>
            `;
      jobItem.appendChild(applyLink);
      jobItem.appendChild(showDetailsButton);
      jobItem.appendChild(jobDetailsDiv);

      jobListFragment.appendChild(jobItem);
    });

    jobList.appendChild(jobListFragment);
  }
});
