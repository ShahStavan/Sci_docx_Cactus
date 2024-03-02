import Image from "next/image";
import styled from "styled-components";
import * as React from "react";
import ReactTextareaAutosize from "react-textarea-autosize";
import { useEnterSubmit } from "@/lib/hooks/use-enter-submit";
import { Popover, PopoverContent, PopoverTrigger } from "./popover";
import { toast } from "react-toastify";

export interface PromptProps {
  input: string;
  setInput: React.SetStateAction<any>;
  onSubmit: (value: string) => void;
  isLoading: boolean;
}

interface DocumentItemProps {
  src: string;
  alt: string;
  text: string;
  hasBorderBottom?: boolean;
  onClick?: () => void;
}

const colors: Record<string, string> = {
  pdf: "red",
  ppt: "blue",
  tex: "green",
  doc: "purple",
  zip: "orange",
};

const DocumentItemContainer = styled.div<{ color: string }>`
  cursor: pointer;
  &:hover {
    background-color: #f4f4f4;
  }
  svg {
    fill: ${(props) => props.color};
  }
`;

function DocumentItem({
  src,
  alt,
  text,
  hasBorderBottom = true,
  onClick,
}: DocumentItemProps) {
  return (
    <DocumentItemContainer
      color={colors[alt]}
      onClick={onClick}
      className={`docCard flex items-center gap-4 py-4 px-2 rounded-lg text-sm font-medium ${
        hasBorderBottom ? "" : ""
      }`}
    >
      <Image src={src} alt={alt} width={24} height={24} />
      <p>{text}</p>
    </DocumentItemContainer>
  );
}

export default function InputBox({
  onSubmit,
  input,
  setInput,
  isLoading,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit();
  const inputRef = React.useRef<HTMLTextAreaElement>(null);
  const [selectedFile, setSelectedFile] = React.useState<File | null>(null);

  const handleFileSelect = (fileType: string) => {
    let accept = "";
    switch (fileType) {
      case "pdf":
        accept = ".pdf";
        break;
      case "ppt":
        accept = ".pptx";
        break;
      case "doc":
        accept = ".docx";
        break;
      case "oext":
        accept = ".tex,.docx,.pptx,.txt,.epub,.csv,.ipynb,.xlsx,.json";
        break;
      default:
        break;
    }

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = accept;
    fileInput.onchange = (e) => {
      const files = (e.target as HTMLInputElement).files;
      if (files && files.length > 0) {
        setSelectedFile(files[0]);

        // Send file to Flask API
        const formData = new FormData();
        formData.append("file", files[0]);

        fetch("http://127.0.0.1:5000/upload", {
          method: "POST",
          body: formData,
        })
          .then((response) => {
            if (!response.ok) {
              toast.error("File Upload Failed! Try uploading the file again.");
            }
            return response.text();
          })
          .then((data) => {
            console.log(data);
            // File uploaded successfully, allow user to enter prompt
            toast.success(
              "File has been uploaded & processed successfully. You can begin querying now"
            );
          })
          .catch((error) => {
            toast.error("Error uploading file:", error.message);
          });
      }
    };
    fileInput.click();
  };

  const handleModelSubmit = () => {
    if (!input || !input.trim()) {
      toast.error("Please enter a prompt!");
      return;
    }

    const formData = new FormData();
    formData.append("userId", "C9N4g6ffcDgyrwZH07KDZlmgEZV2");
    formData.append("prompt", input);

    fetch("http://127.0.0.1:5000/model", {
      method: "POST",
      body: formData,
    })
      .then((response) => {
        if (!response.ok) {
          toast.error("Failed to send prompt! Try again.");
        }
        return response.text();
      })
      .then((data) => {
        console.log(data);
        // Handle response from Flask API
      })
      .catch((error) => {
        toast.error("Error sending prompt:", error.message);
      });
  };

  return (
    <ChatInput
      className="fixed bottom-4 left-12 right-12 flex flex-col gap-2 items-center justify-center z-50"
      onSubmit={async (e) => {
        e.preventDefault();
        if (!input?.trim()) {
          return;
        }
        setInput("");
        onSubmit(input);
      }}
      ref={formRef}
    >
      {selectedFile?.name && selectedFile?.name.length > 0 ? (
        <div className="fileName relative flex items-end justify-end text-gray-500">
          <div className="flex justify-center items-center gap-2">
            <div className="icon">
              <Image src="/document.svg" alt="File" width={24} height={24} />
            </div>
            <p>
              {selectedFile.name.length > 20
                ? selectedFile.name.substring(0, 20) + "..." // Display only first 20 characters
                : selectedFile.name}
              .{selectedFile.name.split(".").pop()}{" "}
              {/* Display file extension */}
            </p>
          </div>
        </div>
      ) : (
        <div></div>
      )}

      <div className="innerPrompt relative flex items-center justify-center overflow-hidden max-h-60 grow bg-background sm:rounded-md sm:border sm:px-12">
        <Popover>
          <PopoverTrigger asChild>
            <button className="add">
              <Image src="/plus.svg" alt="Add" width={32} height={32} />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-auto mb-3 rounded-2xl">
            <div className="grid">
              <DocumentItem
                src="/document.svg"
                alt="pdf"
                text="Add a PDF"
                onClick={() => handleFileSelect("pdf")}
              />
              <DocumentItem
                src="/document.svg"
                alt="ppt"
                text="Add a PPT"
                onClick={() => handleFileSelect("ppt")}
              />
              <DocumentItem
                src="/document.svg"
                alt="doc"
                text="Add a Doc"
                onClick={() => handleFileSelect("doc")}
              />
              <DocumentItem
                src="/document.svg"
                alt="oext"
                text="Add Others ext"
                onClick={() => handleFileSelect("oext")}
                hasBorderBottom={false}
              />
            </div>
          </PopoverContent>
        </Popover>
        <ReactTextareaAutosize
          ref={inputRef}
          tabIndex={0}
          onKeyDown={onKeyDown}
          rows={1}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Send a message..."
          spellCheck={false}
          className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
        />
        <span className="standby" />
        <button
          onClick={handleModelSubmit}
          disabled={isLoading || input === ""}
          className="submit flex justify-center items-center gap-2 px-6"
        >
          <Image src="/send.svg" alt="Add" width={24} height={24} />
          <p>Submit</p>
        </button>
      </div>
      <div className="relative flex items-center justify-end text-gray-500">
        <p>
          Open-source AI chatbot built by{" "}
          <i>
            <b>The Develomers</b>
          </i>
        </p>
      </div>
    </ChatInput>
  );
}

const ChatInput = styled.form`
  .innerPrompt {
    background-color: #111111;
    color: #ffffff;
    font-size: 14px;
    width: fit-content;
    height: fit-content;
    gap: 16px;
    border-radius: 50px;
    padding: 10px;
    filter: drop-shadow(0.35rem 0.35rem 0.4rem rgba(0, 0, 0, 0.5));

    .popu {
      background-color: #111111;
    }

    .add {
      background-color: #283437;
      border-radius: 50%;
      color: #b2f1ff;
      width: 60px;
      height: 60px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        box-shadow: 0 0 0 2px #111111, 0 0 0 4px #283437;
      }
    }

    textarea {
      background: none;
      border: none;
      font-size: 1.15rem;
      flex: 1;
      outline: none;

      &::placeholder {
        color: #ffffff;
        font-weight: 400;
        opacity: 0.6;
      }
    }

    .standby {
      height: 20px;
      width: 3px;
      border-radius: 10px;
      background-color: #505050;
    }

    .submit {
      background-color: #fefefe;
      border-radius: 50px;
      color: #333333;
      width: fit-content;
      height: 60px;
      cursor: pointer;
      font-weight: 700;
      font-size: 17px;
      transition: all 0.2s;

      &:hover:not(:disabled) {
        box-shadow: 0 0 0 2px #111111, 0 0 0 4px #fefefe;
      }
    }
  }

  .fileName {
    background-color: #111111;
    color: #ffffff;
    font-size: 14px;
    width: fit-content;
    height: fit-content;
    gap: 16px;
    border-radius: 50px;
    padding: 6px 16px 6px 6px;

    .icon {
      background-color: #fefefe;
      border-radius: 50%;
      width: 36px;
      height: 36px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
`;
