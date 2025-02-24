function generateCover() {
    const form = document.getElementById('coverForm');
    const preview = document.getElementById('preview');
    preview.innerHTML = '';

    const studentName = form.studentName.value;
    const studentId = form.studentId.value;
    const courseName = form.courseName.value;
    const courseCode = form.courseCode.value;
    const department = form.department.value;
    const instructorName = form.instructorName.value;
    const designation = form.designation.value;
    const submissionDate = form.submissionDate.value;
    const topic = form.topic.value;

    const cover = document.createElement('div');
    cover.className = 'design-option active';

    let content = `
    <div id="style1">
        <img src="${selectedImageSrc}" width="160">
        <div>
            <!-- Not rendering course-box if both fields are empty -->
            ${courseName || courseCode ? `
                <div class="course-box">
                    <p>${courseName}</p>
                    <p>${courseCode}</p>
                </div>
            ` : ''}            
            <div class="topic-box">
                <span>${form.reportType.value == "assignment" ? "Assignment on" : "Lab report on"}</span>
                <span>${topic}</span>
            </div>
        </div>
        <div class="sub-by info-box">
            <h3>Submitted By:</h3>
            <p><strong>Name:</strong> ${studentName}</p>
            <p><strong>ID:</strong> ${studentId}</p>
            <p><strong>Department:</strong> ${department}</p>
        </div>
        <div class="sub-to info-box">
            <h3>Submitted To:</h3>
            <p><strong>Name:</strong> ${instructorName}</p>
            <p>${designation}</p>
        </div>

        <p class="sub-date">Submitted on ${formatSubmissionDate(submissionDate)}</p>

    </div>
`;

    // Clearing previous links
    preview.innerHTML = '';

    cover.innerHTML = content;
    preview.appendChild(cover);

    html2canvas(cover, { width: 794, height: 1123 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        const buttonContainer = document.createElement('div');
        buttonContainer.className = 'd-flex justify-content-center mt-3';

        const link = document.createElement('a');
        link.className = 'btn btn-success download-btn m-2';
        link.href = imgData;
        link.download = 'cover-page.png';
        link.textContent = 'Download as Image';

        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
        const pdfLink = document.createElement('a');
        pdfLink.className = 'btn btn-success download-btn m-2';
        pdfLink.href = pdf.output('bloburl');
        pdfLink.textContent = 'Download as PDF';

        // Append buttons to the container
        buttonContainer.appendChild(link);
        buttonContainer.appendChild(pdfLink);

        // Append the button container to the preview
        preview.appendChild(buttonContainer);

    });
}

// Initial preview load
window.addEventListener('load', function () {
    generateCover();
});

// Logo change
let selectedImageSrc = '/gblogo.png'; // Default image source

document.getElementById('instImg').addEventListener('change', function (event) {
    const file = event.target.files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function (e) {
            const imgElement = document.getElementById('instPreview');
            imgElement.src = e.target.result;
            selectedImageSrc = e.target.result;
            generateCover();
        };

        reader.readAsDataURL(file);
    }
});

// Date format change
function formatSubmissionDate(dateString) {
    const date = new Date(dateString);
    const day = date.getDate();
    const month = date.toLocaleString('default', { month: 'long' });
    const year = date.getFullYear();

    const suffix = (day) => {
        if (day > 3 && day < 21) return 'th'; // Catch 11th-13th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    const ordinalSuffix = suffix(day);
    return `${day}<sup>${ordinalSuffix}</sup> ${month} ${year}`;
}

// Setting a default date for datepicker field

// Get today's date
const today = new Date();
const formattedDate = today.toISOString().slice(0, 10); // Format: YYYY-MM-DD

// Set the value of the date input
document.getElementById("submissionDate").value = formattedDate;

// Limiting generateCover() function fire rate
const preview = document.getElementById('preview');

function debounce(func, wait) {
    let timeout;
    return function (...args) {
        const context = this;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

const debouncedGenerateCover = debounce(generateCover, 300);

// Replace event listeners in this format 
document.getElementById("reportType").addEventListener("input", debouncedGenerateCover);
document.getElementById("studentName").addEventListener("input", debouncedGenerateCover);
document.getElementById("studentId").addEventListener("input", debouncedGenerateCover);
document.getElementById("courseName").addEventListener("input", debouncedGenerateCover);
document.getElementById("courseCode").addEventListener("input", debouncedGenerateCover);
document.getElementById("department").addEventListener("input", debouncedGenerateCover);
document.getElementById("instructorName").addEventListener("input", debouncedGenerateCover);
document.getElementById("designation").addEventListener("input", debouncedGenerateCover);
document.getElementById("submissionDate").addEventListener("input", debouncedGenerateCover);
document.getElementById("topic").addEventListener("input", debouncedGenerateCover);

// Including current year on footer
document.getElementById('currentYear').textContent = new Date().getFullYear();
