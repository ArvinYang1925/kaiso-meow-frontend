import React, { useState } from "react";
import { learningService } from "@/services/learningService";
import { Section, CourseSectionsApiResponse } from "@/types/course";

const ApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<Section | null>(null);
  const [courseSections, setCourseSections] =
    useState<CourseSectionsApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Example courseId and sectionId from your API response
  const exampleCourseId = "aef5acc5-dd71-428d-83e2-e17b01964c3f";
  const exampleSectionId = "d770b502-a2a9-4721-916f-66a4413069af";

  const testSectionApi = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Testing Section API with:", {
        courseId: exampleCourseId,
        sectionId: exampleSectionId,
      });

      const response = await learningService.getCourseSection(
        exampleCourseId,
        exampleSectionId
      );

      console.log("Section API Response:", response);

      if (response.status === "success") {
        setSection(response.data.section);
      } else {
        setError(`Section API Error: ${response.message}`);
      }
    } catch (err: any) {
      console.error("Section API Test Error:", err);
      setError(`Section Connection Error: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  const testCourseSectionsApi = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log(
        "Testing Course Sections API with courseId:",
        exampleCourseId
      );

      const response = await learningService.getCourseSectionsList(
        exampleCourseId
      );

      console.log("Course Sections API Response:", response);

      if (response.status === "success") {
        setCourseSections(response);
      } else {
        setError(`Course Sections API Error: ${response.message}`);
      }
    } catch (err: any) {
      console.error("Course Sections API Test Error:", err);
      setError(
        `Course Sections Connection Error: ${err.message || "Unknown error"}`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        API Connection Test
      </h2>

      <div className="mb-6 space-y-4">
        <div>
          <p className="text-gray-600 mb-2">
            <strong>Section Endpoint:</strong> GET /api/v1/courses/
            {`{courseId}`}/sections/{`{sectionId}`}
          </p>
          <button
            onClick={testSectionApi}
            disabled={loading}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mr-2"
          >
            {loading ? "Testing..." : "Test Section API"}
          </button>
        </div>

        <div>
          <p className="text-gray-600 mb-2">
            <strong>Course Sections Endpoint:</strong> GET /api/v1/courses/
            {`{courseId}`}/sections
          </p>
          <button
            onClick={testCourseSectionsApi}
            disabled={loading}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Testing..." : "Test Course Sections API"}
          </button>
        </div>

        <p className="text-gray-600 text-sm">
          <strong>Test Course ID:</strong> {exampleCourseId}
        </p>
        <p className="text-gray-600 text-sm">
          <strong>Test Section ID:</strong> {exampleSectionId}
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {courseSections && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-4">
            ✅ Course Sections API Success!
          </h3>

          <div className="mb-4">
            <h4 className="font-semibold text-gray-800 mb-2">Course Info:</h4>
            <ul className="space-y-1 text-sm text-gray-700">
              <li>
                <strong>Course ID:</strong> {courseSections.data.course.id}
              </li>
              <li>
                <strong>Course Title:</strong>{" "}
                {courseSections.data.course.title}
              </li>
              <li>
                <strong>Total Sections:</strong>{" "}
                {courseSections.data.sections.length}
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold text-gray-800 mb-2">Sections List:</h4>
            <div className="max-h-48 overflow-y-auto bg-gray-50 p-3 rounded">
              {courseSections.data.sections.map((section, index) => (
                <div
                  key={section.id}
                  className="border-b border-gray-200 py-2 last:border-b-0"
                >
                  <div className="text-sm">
                    <span className="font-medium">
                      {section.order}. {section.title}
                    </span>
                    <div className="text-gray-600 text-xs">
                      ID: {section.id}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {section && (
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="text-blue-800 font-semibold mb-4">
            ✅ Section API Success!
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Section Details:
              </h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  <strong>ID:</strong> {section.id}
                </li>
                <li>
                  <strong>Title:</strong> {section.title}
                </li>
                <li>
                  <strong>Course ID:</strong> {section.courseId}
                </li>
                <li>
                  <strong>Course Name:</strong> {section.courseName}
                </li>
                <li>
                  <strong>Order:</strong> {section.order}
                </li>
                <li>
                  <strong>Completed:</strong>{" "}
                  {section.progress.isCompleted ? "Yes" : "No"}
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold text-gray-800 mb-2">Navigation:</h4>
              <ul className="space-y-1 text-sm text-gray-700">
                <li>
                  <strong>Next Section:</strong>
                  {section.nextSection ? section.nextSection.title : "None"}
                </li>
                <li>
                  <strong>Previous Section:</strong>
                  {section.prevSection ? section.prevSection.title : "None"}
                </li>
              </ul>

              {section.videoUrl1 && (
                <div className="mt-4">
                  <h4 className="font-semibold text-gray-800 mb-2">
                    Video URL:
                  </h4>
                  <p className="text-xs text-blue-600 break-all">
                    {section.videoUrl1}
                  </p>
                  {section.videoUrl1.includes(".m3u8") && (
                    <p className="text-xs text-green-600 mt-1">
                      ✅ HLS Stream Detected (.m3u8)
                    </p>
                  )}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h4 className="font-semibold text-gray-800 mb-2">
              Content Preview:
            </h4>
            <div
              className="text-sm text-gray-700 bg-gray-50 p-3 rounded max-h-32 overflow-y-auto"
              dangerouslySetInnerHTML={{
                __html: section.content.substring(0, 200) + "...",
              }}
            />
          </div>
        </div>
      )}

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <h3 className="text-blue-800 font-semibold mb-2">Usage Examples:</h3>
        <pre className="text-sm text-gray-700 bg-white p-3 rounded overflow-x-auto">
          {`// Import the service
import { learningService } from "@/services/learningService";

// Get course sections for sidebar
const fetchCourseSections = async () => {
  try {
    const response = await learningService.getCourseSectionsList(courseId);
    if (response.status === "success") {
      const { course, sections } = response.data;
      // Use course title and sections list...
    }
  } catch (error) {
    console.error("Error:", error);
  }
};

// Get specific section details
const fetchSection = async () => {
  try {
    const response = await learningService.getCourseSection(
      courseId, 
      sectionId
    );
    if (response.status === "success") {
      const sectionData = response.data.section;
      // Use the section data...
    }
  } catch (error) {
    console.error("Error:", error);
  }
};`}
        </pre>
      </div>
    </div>
  );
};

export default ApiTest;
