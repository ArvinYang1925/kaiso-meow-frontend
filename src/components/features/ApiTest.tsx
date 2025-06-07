import React, { useState } from "react";
import { learningService } from "@/services/learningService";
import { Section } from "@/types/course";

const ApiTest: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [section, setSection] = useState<Section | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Example courseId and sectionId from your API response
  const exampleCourseId = "aef5acc5-dd71-428d-83e2-e17b01964c3f";
  const exampleSectionId = "d770b502-a2a9-4721-916f-66a4413069af";

  const testApiConnection = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Testing API with:", {
        courseId: exampleCourseId,
        sectionId: exampleSectionId,
      });

      const response = await learningService.getCourseSection(
        exampleCourseId,
        exampleSectionId
      );

      console.log("API Response:", response);

      if (response.status === "success") {
        setSection(response.data.section);
      } else {
        setError(`API Error: ${response.message}`);
      }
    } catch (err: any) {
      console.error("API Test Error:", err);
      setError(`Connection Error: ${err.message || "Unknown error"}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">
        API Connection Test
      </h2>

      <div className="mb-6">
        <p className="text-gray-600 mb-2">
          <strong>Endpoint:</strong> GET /api/v1/courses/{`{courseId}`}
          /sections/{`{sectionId}`}
        </p>
        <p className="text-gray-600 mb-2">
          <strong>Test Course ID:</strong> {exampleCourseId}
        </p>
        <p className="text-gray-600 mb-4">
          <strong>Test Section ID:</strong> {exampleSectionId}
        </p>

        <button
          onClick={testApiConnection}
          disabled={loading}
          className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? "Testing..." : "Test API Connection"}
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {section && (
        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
          <h3 className="text-green-800 font-semibold mb-4">
            ✅ API Connection Successful!
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
        <h3 className="text-blue-800 font-semibold mb-2">Usage Example:</h3>
        <pre className="text-sm text-gray-700 bg-white p-3 rounded overflow-x-auto">
          {`// Import the service
import { learningService } from "@/services/learningService";

// Use in your component
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
